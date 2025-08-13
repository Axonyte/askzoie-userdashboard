import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./exceptions/HttpExceptionFilter";
import { json } from "express";

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
    await app.listen(process.env.PORT ?? 3000);
    app.useGlobalFilters(new HttpExceptionFilter());
}
bootstrap();
