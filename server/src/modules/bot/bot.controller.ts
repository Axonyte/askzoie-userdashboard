// bot.controller.ts
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { BotService } from "./bot.service";
import { UserId } from "src/decorators/userId.decorator";
import { SaveBotConfigDto } from "./dto/save-bot-config.dto";
import { BotGuard } from "src/guards/bot.guard";
import { BotConfigId } from "src/decorators/bot-config-id.decorator";

@Controller("bot")
export class BotController {
    constructor(private readonly botService: BotService) {}

    @Post("save")
    saveBotConfiguration(
        @UserId() userId: string,
        @Body() dto: SaveBotConfigDto
    ) {
        return this.botService.saveBotConfiguration(userId, dto);
    }

    @Post("refresh-access-token")
    async refreshAccessToken(@Body("refreshToken") refreshToken: string) {
        return await this.botService.refreshAccessToken(refreshToken);
    }

    @Get("test")
    @UseGuards(BotGuard)
    async test(@BotConfigId() id: string) {
        console.log(id)
        return;
    }
}
