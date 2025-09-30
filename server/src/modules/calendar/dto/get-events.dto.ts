import { IsString, IsOptional, IsDateString, IsNotEmpty } from "class-validator";

export class GetEventsDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;
}
