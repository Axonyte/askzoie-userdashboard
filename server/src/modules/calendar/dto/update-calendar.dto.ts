import { IsString, IsOptional, IsDateString, IsNotEmpty } from "class-validator";

export class UpdateCalendarEventDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsOptional()
    @IsString()
    summary?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDateString()
    startDateTime?: string;

    @IsOptional()
    @IsDateString()
    endDateTime?: string;

    @IsOptional()
    @IsString()
    location?: string;
}
