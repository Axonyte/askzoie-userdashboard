import {
    HttpException,
    HttpStatus,
    Injectable,
    ConflictException,
} from "@nestjs/common";
import { CreateAuthenticationDto } from "./dto/create-authentication.dto";
import { UpdateAuthenticationDto } from "./dto/update-authentication.dto";
import { toTitleCase } from "src/shared/utils/toTitleCase";
import { checkPassword } from "src/shared/utils/checkPassword";
import { hashPassword } from "src/shared/utils/hashPassword";
import { PrismaService } from "src/shared/services/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TUserPayload } from "../user/types/UserPayload";

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly prisma: PrismaService,
        private configService: ConfigService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (user === null) return null;

        if (
            user.accountStatus === "REJECTED" ||
            user.accountStatus === "SUSPENDED"
        ) {
            throw new HttpException(
                `The account has been ${toTitleCase(user.accountStatus)}`,
                HttpStatus.FORBIDDEN
            );
        }

        const passwordValid = checkPassword(password, user.password);

        if (user && passwordValid) {
            return user;
        }

        return null;
    }

    async login(user: any) {
        // if (user.console !== user.userType) {
        //     throw new UnauthorizedException();
        // }

        const payload: TUserPayload = {
            userId: user.id,
            name: user.name,
            email: user.email,
            accountStatus: user.accountStatus,
        };

        user.password = null;
        return {
            ...user,
            accessToken: this.jwtService.sign(payload, {
                secret: this.configService.get<string>("JWT_SECRET"),
                expiresIn: "10 days",
            }),
        };
    }

    async register(createAuthenticationDto: CreateAuthenticationDto) {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: createAuthenticationDto.email,
            },
        });

        if (existingUser) {
            throw new ConflictException("User with this email already exists");
        }

        // Hash the password
        const hashedPassword = hashPassword(createAuthenticationDto.password);

        // Create the user
        const user = await this.prisma.user.create({
            data: {
                email: createAuthenticationDto.email,
                name: createAuthenticationDto.name,
                password: hashedPassword,
                accountStatus: "REVIEWING", // Default status as per schema
            },
        });

        // Generate JWT token
        const payload: TUserPayload = {
            userId: user.id,
            name: user.name,
            email: user.email,
            accountStatus: user.accountStatus,
        };

        // Return user data with token (excluding password)
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            accessToken: this.jwtService.sign(payload, {
                secret: this.configService.get<string>("JWT_SECRET"),
                expiresIn: "10 days",
            }),
        };
    }

    create(createAuthenticationDto: CreateAuthenticationDto) {
        return "This action adds a new authentication";
    }

    findAll() {
        return `This action returns all authentication`;
    }

    findOne(id: number) {
        return `This action returns a #${id} authentication`;
    }

    update(id: number, updateAuthenticationDto: UpdateAuthenticationDto) {
        return `This action updates a #${id} authentication`;
    }

    remove(id: number) {
        return `This action removes a #${id} authentication`;
    }
}
