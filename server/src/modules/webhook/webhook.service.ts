import { Injectable } from "@nestjs/common";
import { CreateWebhookDto } from "./dto/create-webhook.dto";
import { PaypalService } from "../paypal/paypal.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class WebhookService {
    constructor(
        private readonly paypalService: PaypalService,
        private configService: ConfigService
    ) {}

    async handlePaypalEvent(dto: CreateWebhookDto, headers: Record<string, string>) {
        // ✅ Step 1: Verify webhook signature
        const isValid = await this.verifyPaypalWebhookSignature(headers, dto);
        if (!isValid) {
            throw new Error("Invalid PayPal webhook signature");
        }

        // ✅ Step 2: Handle events
        switch (dto.event_type) {
            case "BILLING.SUBSCRIPTION.ACTIVATED":
                console.log("➡️ Subscription Activated:", dto.resource.id);
                // TODO: update your DB, mark subscription active
                break;

            case "BILLING.SUBSCRIPTION.EXPIRED":
                console.log("➡️ Subscription Expired:", dto.resource.id);
                // TODO: mark subscription as expired
                break;

            case "BILLING.SUBSCRIPTION.RE-ACTIVATED":
                console.log("➡️ Subscription Re-Activated:", dto.resource.id);
                // TODO: mark subscription re-activated
                break;

            default:
                console.log("Unhandled PayPal Event:", dto.event_type);
        }

        return true;
    }

    private async verifyPaypalWebhookSignature(
        headers: Record<string, string>,
        body: any
    ): Promise<boolean> {
        const response = await fetch(
            "https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${Buffer.from(
                        this.configService.get("PAYPAL_CLIENT_ID") +
                            ":" +
                            this.configService.get("PAYPAL_SECRET")
                    ).toString("base64")}`,
                },
                body: JSON.stringify({
                    auth_algo: headers["paypal-auth-algo"],
                    cert_url: headers["paypal-cert-url"],
                    transmission_id: headers["paypal-transmission-id"],
                    transmission_sig: headers["paypal-transmission-sig"],
                    transmission_time: headers["paypal-transmission-time"],
                    webhook_id: this.configService.get("PAYPAL_WEBHOOK_ID"),
                    webhook_event: body,
                }),
            }
        );

        const data = await response.json();
        return data.verification_status === "SUCCESS";
    }
}
