import { Module } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { WebhookController } from "./webhook.controller";
import { PaypalModule } from "../paypal/paypal.module";

@Module({
    imports: [PaypalModule],
    controllers: [WebhookController],
    providers: [WebhookService],
})
export class WebhookModule {}
