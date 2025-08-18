import { IsEnum } from "class-validator";
import { Plan } from "generated/prisma";

export class SubscribeDto {
    @IsEnum(Plan)
    plan: Plan;
}
