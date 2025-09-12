import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { Observable } from "rxjs";
import * as jwt from "jsonwebtoken";
import { TBotPayload } from "src/modules/bot/types/BotPayload";
import { extractBotProfileToken } from "src/shared/utils/extractBotProfileToken";

@Injectable()
export class BotGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const request: Request = context.switchToHttp().getRequest();
            const token = extractBotProfileToken(request);
            const payload = jwt.verify(
                token,
                this.configService.get<string>("JWT_SECRET")!
            ) as TBotPayload;

            request.botProfile = payload;

            return true;
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                throw new UnauthorizedException();
            } else if (error.name === "TokenExpiredError") {
                throw new Error("token-expired");
            }
            return false;
        }
    }
}
