import { Module } from "@nestjs/common";
import { ApplicationSetupService } from "./application-setup.service";
import { BotService } from "src/modules/bot/bot.service";
import { JwtService } from "@nestjs/jwt";
import { R2storageService } from "../r2storage/r2storage.service";

@Module({
    providers: [
        ApplicationSetupService,
        BotService,
        JwtService,
        R2storageService,
    ],
})
export class ApplicationSetupModule {}
