import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { SaveBotConfigDto } from "./dto/save-bot-config.dto";
import { ConfigService } from "@nestjs/config";
import { TBotPayload } from "./types/BotPayload";

@Injectable()
export class BotService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async saveBotConfiguration(userId: string, dto: SaveBotConfigDto) {
        // Save bot config
        const botConfig = await this.prisma.botConfig.create({
            data: {
                userId,
                name: dto.name,
                theme: dto.theme,
                description: dto.description,
            },
        });

        // Create refresh token containing botConfig.id
        const refreshToken = this.jwtService.sign(
            {
                botConfigId: botConfig.id,
                userId,
            },
            {
                secret: this.configService.get<string>("JWT_SECRET"),
            }
        );

        return {
            botConfig,
            refreshToken,
        };
    }

    async refreshAccessToken(refreshToken: string) {
        try {
            // Verify the refresh token
            const decoded = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_SECRET"),
            });

            // Extract botConfigId and userId from the refresh token
            const { botConfigId, userId } = decoded;

            if (!botConfigId || !userId) {
                throw new UnauthorizedException(
                    "Invalid refresh token payload"
                );
            }

            // Fetch the bot configuration from database
            const botConfig = await this.prisma.botConfig.findUnique({
                where: {
                    id: botConfigId,
                },
                select: {
                    id: true,
                    userId: true,
                    name: true, // This is the Bot enum
                    theme: true,
                },
            });

            // Verify bot config exists and belongs to the user
            if (!botConfig) {
                throw new UnauthorizedException("Bot configuration not found");
            }

            if (botConfig.userId !== userId) {
                throw new UnauthorizedException(
                    "Bot configuration does not belong to user"
                );
            }

            const payload: TBotPayload = {
                userId: botConfig.userId,
                bot: botConfig.name, // Bot enum value (ZOIE, OPTIMUS, JARVIS)
                colorScheme: botConfig.theme,
                configId: botConfig.id,
            };

            // Create access token with 30 minutes expiry
            const accessToken = this.jwtService.sign(payload, {
                secret: this.configService.get<string>("JWT_SECRET"),
                expiresIn: "30m", // 30 minutes
            });

            return {
                accessToken,
                expiresIn: 1800, // 30 minutes in seconds
            };
        } catch (error) {
            // Handle JWT verification errors and other exceptions
            if (error.name === "JsonWebTokenError") {
                throw new UnauthorizedException("Invalid refresh token");
            }
            if (error.name === "TokenExpiredError") {
                throw new UnauthorizedException("Refresh token expired");
            }
            throw new UnauthorizedException("Token verification failed");
        }
    }
}
