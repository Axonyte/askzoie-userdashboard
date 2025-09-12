// bot.controller.ts
import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { BotService } from "./bot.service";
import { UserId } from "src/decorators/userId.decorator";
import { SaveBotProfileDto } from "./dto/save-bot-config.dto";
import { BotGuard } from "src/guards/bot.guard";
import { BotProfileId } from "src/decorators/bot-profile-id.decorator";
import { AddPersonaDto } from "./dto/add-persona.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerImageOptions } from "src/config/multer/MulterConfig";
import { EditBotProfileDto } from "./dto/edit-bot-config.dto";

@Controller("bot")
export class BotController {
    constructor(private readonly botService: BotService) {}

    @Post("add-persona")
    addBotPersona(@Body() dto: AddPersonaDto) {
        return this.botService.addBotPersona(dto);
    }

    @Post("save")
    @UseInterceptors(FileInterceptor("file", multerImageOptions))
    async saveBotProfile(
        @UserId() userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any // <-- raw form-data body
    ) {
        // Parse fields from form-data
        const dto: SaveBotProfileDto = {
            personaId: body.personaId,
            name: body.name,
            customGreeting: body.customGreeting,
            customFallback: body.customFallback,
            tone: body.tone,
            primaryLanguage: body.primaryLanguage,
            allowedTopics: body.allowedTopics
                ? body.allowedTopics.split(",").map((t: string) => t.trim())
                : undefined,
            blockedTopics: body.blockedTopics
                ? body.blockedTopics.split(",").map((t: string) => t.trim())
                : undefined,
            responseLength: body.responseLength as
                | "SHORT"
                | "MEDIUM"
                | "DETAILED",
        };

        return this.botService.saveBotProfile(userId, dto, file);
    }

    @Patch("edit-assistant")
    @UseInterceptors(FileInterceptor("file", multerImageOptions))
    async editAssistant(
        @UserId() userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any // <-- raw form-data body
    ) {
        // Parse fields from form-data
        const dto: EditBotProfileDto = {
            name: body.name,
            profileId: body.profileId,
            customGreeting: body.customGreeting,
            customFallback: body.customFallback,
            tone: body.tone,
            primaryLanguage: body.primaryLanguage,
            allowedTopics: body.allowedTopics
                ? body.allowedTopics.split(",").map((t: string) => t.trim())
                : undefined,
            blockedTopics: body.blockedTopics
                ? body.blockedTopics.split(",").map((t: string) => t.trim())
                : undefined,
            responseLength: body.responseLength as
                | "SHORT"
                | "MEDIUM"
                | "DETAILED",
        };

        return this.botService.editAssistant(userId, dto, file);
    }

    @Get("available-personas")
    fetchAvailablePersonas() {
        return this.botService.fetchAvailablePersonas();
    }

    @Get("user-bots")
    fetchUserBots(@UserId() userId: string) {
        return this.botService.fetchUserBots(userId);
    }

    @Get("user-bot/:botId")
    fetchUserBotById(@Param("botId") botId: string) {
        return this.botService.fetchUserBotById(botId);
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
