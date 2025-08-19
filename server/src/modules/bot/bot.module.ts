import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { BotController } from "./bot.controller";
import { JwtService } from "@nestjs/jwt";

@Module({
    controllers: [BotController],
    providers: [BotService, JwtService],
})
export class BotModule {}
