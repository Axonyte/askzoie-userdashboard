import { IsEnum, IsOptional, IsString } from "class-validator";
import { Bot } from "generated/prisma";

export class SaveBotConfigDto {
    @IsEnum(Bot)
    name: Bot;

    @IsString()
    theme: string;

    @IsOptional()
    @IsString()
    description?: string;
}
