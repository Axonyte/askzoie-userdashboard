import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    ClassSerializerInterceptor,
    UseGuards,
    Request,
} from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { CreateAuthenticationDto } from "./dto/create-authentication.dto";
import { UpdateAuthenticationDto } from "./dto/update-authentication.dto";
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

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authenticationService.forgotPassword(forgotPasswordDto);
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authenticationService.resetPassword(resetPasswordDto);
    }
}
