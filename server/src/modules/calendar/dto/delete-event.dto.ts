import { IsString, IsNotEmpty } from "class-validator";

export class DeleteEventDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    eventId: string;
}
