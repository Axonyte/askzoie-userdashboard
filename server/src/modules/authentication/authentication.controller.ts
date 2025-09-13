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
    Res,
    Redirect,
} from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { CreateAuthenticationDto } from "./dto/create-authentication.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { AuthGuard } from "@nestjs/passport";
import { AuthEntity } from "./entities/authentication.entity";
import type { Response } from "express";

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
    async googleAuthRedirect(
        @Req() req,
        @Res({ passthrough: true }) res: Response
    ) {
        const user = await this.authenticationService.googleLogin(req.user);

        // Set cookie with your app's JWT (not Google token)
        res.cookie("auth-token", JSON.stringify(user.accessToken), {
            // httpOnly: true, // protects against XSS
            secure: process.env.NODE_ENV === "production", // use HTTPS in prod
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Redirect user to frontend
        return res.redirect("http://localhost:5173/");
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
