import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    ClassSerializerInterceptor,
    UseGuards,
    Request,
    Get,
    Req,
} from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { CreateAuthenticationDto } from "./dto/create-authentication.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { AuthGuard } from "@nestjs/passport";
import { AuthEntity } from "./entities/authentication.entity";

@Controller("auth")
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService
    ) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Post("register")
    async register(@Body() createAuthenticationDto: CreateAuthenticationDto) {
        const user = await this.authenticationService.register(
            createAuthenticationDto
        );
        return new AuthEntity(user);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("local"))
    @Post("login")
    async login(@Request() req: any) {
        const user = await this.authenticationService.login(req.user);
        return new AuthEntity(user);
    }

    @Get("google")
    @UseGuards(AuthGuard("google"))
    async googleAuth() {
        // initiates the Google OAuth2 login flow
    }

    @Get("google/callback")
    @UseGuards(AuthGuard("google"))
    async googleAuthRedirect(@Req() req) {
        // handle redirect from Google
        return this.authenticationService.googleLogin(req.user);
    }

    @Post("forgot-password")
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authenticationService.forgotPassword(forgotPasswordDto);
    }

    @Post("reset-password")
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authenticationService.resetPassword(resetPasswordDto);
    }
}
