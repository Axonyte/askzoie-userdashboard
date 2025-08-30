import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const BotProfileId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return request.botProfile.profileId;
    }
);
