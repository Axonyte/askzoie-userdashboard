import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { BotController } from "./bot.controller";
import { JwtService } from "@nestjs/jwt";
import { R2storageService } from "src/shared/services/r2storage/r2storage.service";

@Module({
    controllers: [BotController],
    providers: [BotService, JwtService,R2storageService],
})
export class BotModule {}
