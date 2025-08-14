import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthenticationDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(6)
    password: string;
}
