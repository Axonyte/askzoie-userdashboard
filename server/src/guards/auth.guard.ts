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
import { extractTokenFromHeader } from "src/shared/utils/extractTokenFromHeader";
import { TUserPayload } from "src/modules/user/types/UserPayload";
import { isPublicRoute } from "src/shared/utils/isPublicRoute";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const request: Request = context.switchToHttp().getRequest();
            if (isPublicRoute(request.url) || request.url.startsWith("/auth/google/callback")) {
                return true;
            }
            const token = extractTokenFromHeader(request);
            const payload = jwt.verify(
                token,
                this.configService.get<string>("JWT_SECRET") as string
            ) as TUserPayload;

            request.user = payload;

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
