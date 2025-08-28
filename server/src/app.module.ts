import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { AppService } from "./app.service";
import { AuthenticationModule } from "./modules/authentication/authentication.module";
import { UserModule } from "./modules/user/user.module";
import { PrismaModule } from "./shared/services/prisma/prisma-module.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";
import { SubscriptionModule } from "./modules/subscription/subscription.module";
import { BotModule } from "./modules/bot/bot.module";
import { PaypalModule } from './modules/paypal/paypal.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            isGlobal: true,
        }),
        PrismaModule,
        MailerModule.forRoot({
            transport: {
                host: process.env.NODE_MAILER_HOST,
                secure: true,
                auth: {
                    user: process.env.NODE_MAILER_USER,
                    pass: process.env.NODE_MAILER_PASS,
                },
            },
            defaults: {
                from: '"No Reply" <noreply@example.com>',
            },
            template: {
                dir: join(__dirname, "templates"),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        AuthenticationModule,
        UserModule,
        SubscriptionModule,
        BotModule,
        PaypalModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
