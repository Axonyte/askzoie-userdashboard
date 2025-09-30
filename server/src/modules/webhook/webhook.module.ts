import { Module } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { WebhookController } from "./webhook.controller";
import { PaypalService } from "../paypal/paypal.service";

@Module({
    controllers: [WebhookController],
    providers: [WebhookService, PaypalService],
})
export class WebhookModule {}
