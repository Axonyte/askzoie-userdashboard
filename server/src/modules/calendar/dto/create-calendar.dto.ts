import {
    IsString,
    IsNotEmpty,
    IsDateString,
    IsOptional,
    IsArray,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class AttendeeDto {
    @IsString()
    @IsNotEmpty()
    email: string;
}

export class CreateCalendarDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    summary: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDateString()
    startDateTime: string;

    @IsDateString()
    endDateTime: string;

    @IsOptional()
    @IsString()
    timeZone?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AttendeeDto)
    attendees?: AttendeeDto[];
}
