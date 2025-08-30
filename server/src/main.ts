import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./exceptions/HttpExceptionFilter";
import { json } from "express";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "./guards/auth.guard";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        rawBody: true, // Enable raw body parsing
    });
    app.use(
        json({
            verify: (req: any, res, buf) => {
                if (req.url.startsWith("/webhook")) {
                    req.rawBody = buf;
                }
                return true;
            },
        })
    );

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalGuards(new AuthGuard(new ConfigService()));

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // 👈 this enables `@Type(() => Number)` and `@Transform(...)`
        })
    );

    app.enableCors({
        allowedHeaders: ["content-type", "authorization", "X-Bot-Profile"],
        origin: ["http://localhost:5173"],
        credentials: true,
    });

    await app.listen(process.env.PORT ?? 3000);

    console.log(`HTTP server running on: ${await app.getUrl()}`);
}
bootstrap();
