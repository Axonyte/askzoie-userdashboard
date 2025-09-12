import { IsString, IsOptional, IsIn } from "class-validator";

export class AddPersonaDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsIn(["male", "female", "neutral"])
    gender?: string;

    @IsOptional()
    @IsString()
    systemPrompt?: string;

    @IsOptional()
    @IsString()
    defaultTone?: string;

    @IsOptional()
    @IsString()
    defaultDomain?: string;

    @IsOptional()
    @IsString()
    defaultGreeting?: string;

    @IsOptional()
    @IsString()
    defaultFallback?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @IsOptional()
    @IsString()
    language?: string;
}
