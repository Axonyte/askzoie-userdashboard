import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./exceptions/HttpExceptionFilter";
import { json } from "express";
import { ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "./guards/auth.guard";
import { ConfigService } from "@nestjs/config";
import { AllowedDomainsService } from "./shared/services/allowed-domains/allowed-domains.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        rawBody: true, // Enable raw body parsing
    });
    app.use(
        json({
            verify: (req: any, res, buf) => {
                // if (req.url.startsWith("/webhook")) {        TODO: this is needed for stripe only not for paypal
                //     req.rawBody = buf;
                // }
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

    const allowedDomainsService = app.get(AllowedDomainsService);
    const origins = await allowedDomainsService.getAllEnabledOrigins();

    app.enableCors({
        allowedHeaders: ["content-type", "authorization", "X-Bot-Profile"],
        origin: [process.env.FRONTEND_URL, ...origins],
        credentials: true,
    });

    await app.listen(process.env.PORT ?? 3000);

    console.log(`HTTP server running on: ${await app.getUrl()}`);
}
bootstrap();
