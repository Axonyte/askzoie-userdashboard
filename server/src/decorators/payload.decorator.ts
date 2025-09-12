import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TUserPayload } from 'src/modules/user/types/UserPayload';

export const Payload = createParamDecorator<TUserPayload | undefined>(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user as TUserPayload;
    },
);
