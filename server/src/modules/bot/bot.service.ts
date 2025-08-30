import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { SaveBotProfileDto } from "./dto/save-bot-config.dto";
import { ConfigService } from "@nestjs/config";
import { TBotPayload } from "./types/BotPayload";
import { AddPersonaDto } from "./dto/add-persona.dto";

@Injectable()
export class BotService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async addBotPersona(dto: AddPersonaDto) {
        return await this.prisma.botPersona.create({
            data: {
                name: dto.name,
                description: dto.description,
                gender: dto.gender,
                systemPrompt: dto.systemPrompt,
                defaultTone: dto.defaultTone,
                defaultDomain: dto.defaultDomain,
                defaultGreeting: dto.defaultGreeting,
                defaultFallback: dto.defaultFallback,
                avatarUrl: dto.avatarUrl,
                language: dto.language ?? "en",
            },
        });
    }

    async saveBotProfile(userId: string, dto: SaveBotProfileDto) {
        // Make sure persona exists
        const persona = await this.prisma.botPersona.findUnique({
            where: { id: dto.personaId },
        });
        if (!persona) {
            throw new NotFoundException("Persona not found");
        }

        const botProfile = await this.prisma.botProfile.create({
            data: {
                userId,
                personaId: dto.personaId,
                name: dto.name,
                customGreeting: dto.customGreeting,
                customFallback: dto.customFallback,
                tone: dto.tone,
                avatarUrl: dto.avatarUrl,
                primaryLanguage: dto.primaryLanguage,
                allowedTopics: dto.allowedTopics ?? [],
                blockedTopics: dto.blockedTopics ?? [],
                responseLength: dto.responseLength,
                // knowledgeSources: dto.knowledgeSources ?? {},
            },
        });

        // Create refresh token containing botConfig.id
        const refreshToken = this.jwtService.sign(
            {
                botProfileId: botProfile.id,
                userId,
            },
            {
                secret: this.configService.get("JWT_SECRET"),
            }
        );

        return {
            botProfile,
            refreshToken,
        };
    }

    async fetchAvailablePersonas() {
        return this.prisma.botPersona.findMany({
            // select: {
            //     id: true,
            //     name: true,
            //     description: true,
            //     gender: true,
            //     avatarUrl: true,
            //     defaultTone: true,
            //     defaultDomain: true,
            //     language: true,
            // },
        });
    }

    async generateRefreshToken(userId: string, botProfileId: string) {
        const botProfile = await this.prisma.botProfile.findUnique({
            where: { id: botProfileId },
        });

        if (!botProfile) {
            throw new NotFoundException("Bot profile not found");
        }

        if (botProfile.userId !== userId) {
            throw new UnauthorizedException(
                "This profile does not belong to the user"
            );
        }

        const refreshToken = this.jwtService.sign(
            {
                botProfileId: botProfile.id,
                userId,
            },
            {
                secret: this.configService.get("JWT_SECRET"),
            }
        );

        return { refreshToken };
    }

    async refreshAccessToken(refreshToken: string) {
        try {
            // Verify the refresh token
            const decoded = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_SECRET"),
            });

            // Extract botConfigId and userId from the refresh token
            const { botProfileId, userId } = decoded;

            if (!botProfileId || !userId) {
                throw new UnauthorizedException(
                    "Invalid refresh token payload"
                );
            }

            // Fetch the bot configuration from database
            const botConfig = await this.prisma.botProfile.findUnique({
                where: {
                    id: botProfileId,
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

            // Build JWT payload aligned with TBotPayload
            const payload: TBotPayload = {
                profileId: botConfig.id, // ✅ bot instance/profile id
                userId: botConfig.userId,
                personaId: botConfig.personaId, // ✅ link to base persona

                // Identity
                name: botConfig.name ?? undefined,
                avatarUrl: botConfig.avatarUrl ?? undefined,

                // Greetings & fallback
                customGreeting: botConfig.customGreeting ?? undefined,
                customFallback: botConfig.customFallback ?? undefined,

                // Style
                tone: botConfig.tone ?? undefined,
                responseLength: botConfig.responseLength ?? undefined,
                primaryLanguage: botConfig.primaryLanguage ?? undefined,

                // Knowledge & topics
                allowedTopics: botConfig.allowedTopics ?? [],
                blockedTopics: botConfig.blockedTopics ?? [],
                knowledgeSources: botConfig.knowledgeSources ?? ({} as any),

                // UI / embedding options
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
