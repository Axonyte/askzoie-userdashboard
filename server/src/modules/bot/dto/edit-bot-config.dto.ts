import {
    IsString,
    IsOptional,
    IsArray,
    IsObject,
    IsUUID,
    IsIn,
} from "class-validator";

export class EditBotProfileDto {

    @IsUUID()
    profileId: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    customGreeting?: string;

    @IsOptional()
    @IsString()
    customFallback?: string;

    @IsOptional()
    @IsString()
    tone?: string;

    @IsOptional()
    @IsString()
    primaryLanguage?: string;

    @IsOptional()
    @IsArray()
    allowedTopics?: string[];

    @IsOptional()
    @IsArray()
    blockedTopics?: string[];

    @IsOptional()
    @IsIn(["SHORT", "MEDIUM", "DETAILED"])
    responseLength?: "SHORT" | "MEDIUM" | "DETAILED";

    // @IsOptional()
    // @IsObject()
    // knowledgeSources?: Record<string, any>;
}
