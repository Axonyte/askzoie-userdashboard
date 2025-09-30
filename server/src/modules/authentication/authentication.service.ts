import {
    HttpException,
    HttpStatus,
    Injectable,
    ConflictException,
} from "@nestjs/common";
import { SubscriptionService } from "../subscription/subscription.service";
import { CreateAuthenticationDto } from "./dto/create-authentication.dto";
import { UpdateAuthenticationDto } from "./dto/update-authentication.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { toTitleCase } from "src/shared/utils/toTitleCase";
import { checkPassword } from "src/shared/utils/checkPassword";
import { hashPassword } from "src/shared/utils/hashPassword";
import { PrismaService } from "src/shared/services/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TUserPayload } from "../user/types/UserPayload";
import { MailerService } from "@nestjs-modules/mailer";
import { randomBytes } from "crypto";
import { GoogleLoginPayload } from "./dto/google-login.dt";
import { AccountStatus, AuthStrategy } from "generated/prisma";

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly prisma: PrismaService,
        private configService: ConfigService,
        private jwtService: JwtService,
        private mailerService: MailerService,
        private subscriptionService: SubscriptionService
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

        if (!user.password) {
            throw new HttpException(
                "You didn't register using email. Please try logging in using google.",
                HttpStatus.BAD_REQUEST
            );
        }

        const passwordValid = checkPassword(password, user.password);

        if (user && passwordValid) {
            return user;
        }

        return null;
    }

    async login(user: any) {
        const payload: TUserPayload = {
            userId: user.id,
            name: user.name,
            email: user.email,
            accountStatus: user.accountStatus,
        };

        return {
            ...user,
            accessToken: this.jwtService.sign(payload, {
                secret: this.configService.get<string>("JWT_SECRET"),
                expiresIn: "10 days",
            }),
        };
    }

    async googleLogin(userDTO: GoogleLoginPayload) {
        if (!userDTO) {
            return { message: "No user from Google" };
        }

        let user = await this.prisma.user.findUnique({
            where: {
                email: userDTO.email,
            },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: userDTO.email,
                    name: userDTO.firstName + " " + userDTO.lastName,
                    accountStatus: AccountStatus.REVIEWING, // Default status as per schema
                    strategies: [AuthStrategy.GOOGLE],
                    GoogleToken: {
                        create: {
                            accessToken: userDTO.accessToken,
                            refreshToken: userDTO.refreshToken,
                        },
                    },
                },
            });
        }

        if (!user?.strategies.includes(AuthStrategy.GOOGLE)) {
            await this.prisma.user.update({
                where: { id: user?.id },
                data: {
                    strategies: { push: AuthStrategy.GOOGLE },
                    GoogleToken: {
                        create: {
                            accessToken: userDTO.accessToken,
                            refreshToken: userDTO.refreshToken,
                        },
                    },
                },
            });
        }

        return this.login(user);
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

        // Create the user with a transaction to ensure both user and subscription are created
        const user = await this.prisma.user.create({
            data: {
                email: createAuthenticationDto.email,
                name: createAuthenticationDto.name,
                password: hashedPassword,
                accountStatus: "REVIEWING", // Default status as per schema,
                strategies: [AuthStrategy.LOCAL],
            },
        });

        // Initialize free subscription
        await this.subscriptionService.initializeFreeSubscription(user.id);

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

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: forgotPasswordDto.email,
            },
        });

        if (!user) {
            // For security reasons, always return success even if email doesn't exist
            return {
                message:
                    "If a registered account exists for this email, a password reset code will be sent.",
            };
        }

        // Generate OTP
        const otp = randomBytes(3).toString("hex"); // 6 character hex OTP
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30); // OTP expires in 30 minutes

        // Save OTP in database
        await this.prisma.oTP.create({
            data: {
                userId: user.id,
                code: otp,
                expiresAt,
            },
        });

        // Send email with OTP
        await this.mailerService.sendMail({
            to: user.email,
            subject: "Password Reset Request",
            template: "./forgot-password.hbs", // you need to create this template
            context: {
                name: user.name,
                otp: otp,
            },
        });

        return {
            message:
                "If a registered account exists for this email, a password reset code will be sent.",
        };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        // Find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: resetPasswordDto.email,
            },
        });

        if (!user) {
            throw new HttpException(
                "Invalid reset attempt",
                HttpStatus.BAD_REQUEST
            );
        }

        // Find valid OTP
        const otp = await this.prisma.oTP.findFirst({
            where: {
                userId: user.id,
                code: resetPasswordDto.otp,
                expiresAt: {
                    gt: new Date(), // OTP hasn't expired
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (!otp) {
            throw new HttpException(
                "Invalid or expired reset code",
                HttpStatus.BAD_REQUEST
            );
        }

        // Hash the new password
        const hashedPassword = hashPassword(resetPasswordDto.newPassword);

        // Update user's password
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
            },
        });

        // Delete all OTPs for this user as they are no longer needed
        await this.prisma.oTP.deleteMany({
            where: {
                userId: user.id,
            },
        });

        return {
            message: "Password has been reset successfully",
        };
    }
}
