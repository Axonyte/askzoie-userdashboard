import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { AuthenticationController } from "./authentication.controller";
import { LocalStrategy } from "./strategies/local.auth";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { SubscriptionService } from "../subscription/subscription.service";

@Module({
    controllers: [AuthenticationController],
    providers: [
        AuthenticationService,
        LocalStrategy,
        ConfigService,
        JwtService,
        SubscriptionService
    ],
})
export class AuthenticationModule {}
