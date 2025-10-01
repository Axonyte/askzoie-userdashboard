import { Controller, Post, Body, HttpCode, Headers } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { CreateWebhookDto } from "./dto/create-webhook.dto";

@Controller("webhook")
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) {}

    @Post("/paypal")
    @HttpCode(200) // PayPal requires 200 on success
    async handlePaypalWebhook(
        @Body() createWebhookDto: CreateWebhookDto,
        @Headers() headers: Record<string, string>
    ) {
        console.log(
            "================ PAYPAL WEBHOOK RECEIVED ================"
        );
        console.log("Event:", createWebhookDto.event_type);

        // ✅ Delegate to service
        await this.webhookService.handlePaypalEvent(createWebhookDto, headers);

        // ✅ Must return 200 OK quickly
        return { status: "ok" };
    }
}
