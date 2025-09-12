import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsArray()
  @IsString({ each: true })
  socialLinks: string[];
}
