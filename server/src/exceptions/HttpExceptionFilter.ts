import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            response.status(status).json({
                status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: exception.message,
            });
        } else {
            response.status(500).json({
                status: 500,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: (exception as Error).message,
            });
        }
    }
}
