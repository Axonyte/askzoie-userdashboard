import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class AddDomainDto {
    @IsString()
    @IsNotEmpty()
    origin: string;

    @IsString()
    @IsOptional()
    description?: string;
}
