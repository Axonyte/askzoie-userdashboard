// bot.controller.ts
import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { BotService } from "./bot.service";
import { UserId } from "src/decorators/userId.decorator";
import { SaveBotProfileDto } from "./dto/save-bot-config.dto";
import { BotGuard } from "src/guards/bot.guard";
import { BotProfileId } from "src/decorators/bot-profile-id.decorator";
import { AddPersonaDto } from "./dto/add-persona.dto";

@Controller("bot")
export class BotController {
    constructor(private readonly botService: BotService) {}

    @Post("add-persona")
    addBotPersona(@Body() dto: AddPersonaDto) {
        return this.botService.addBotPersona(dto);
    }

    @Post("save")
    saveBotProfile(@UserId() userId: string, @Body() dto: SaveBotProfileDto) {
        return this.botService.saveBotProfile(userId, dto);
    }

    @Get("available-personas")
    fetchAvailablePersonas() {
        return this.botService.fetchAvailablePersonas();
    }

    @Get("refresh-token/:botProfileId")
    async getRefreshToken(
        @UserId() userId: string,
        @Param("botProfileId") botProfileId: string
    ) {
        return this.botService.generateRefreshToken(userId, botProfileId);
    }

    @Post("refresh-access-token")
    async refreshAccessToken(@Body("refreshToken") refreshToken: string) {
        return await this.botService.refreshAccessToken(refreshToken);
    }

    @Get("test")
    @UseGuards(BotGuard)
    async test(@BotProfileId() id: string) {
        console.log(id);
        return;
    }
}
