import { Injectable } from "@nestjs/common";
import * as paypal from "@paypal/checkout-server-sdk";

@Injectable()
export class PaypalService {
    private client: paypal.core.PayPalHttpClient;

    constructor() {
        const environment = new paypal.core.SandboxEnvironment(
            process.env.PAYPAL_CLIENT_ID!,
            process.env.PAYPAL_SECRET!
        );

        this.client = new paypal.core.PayPalHttpClient(environment);
    }

    async createOrder(totalAmount: string, currency: string = "USD") {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            application_context: {
                shipping_preference: "NO_SHIPPING", // <-- prevents PayPal from asking/validating address
            },
            purchase_units: [
                {
                    amount: {
                        currency_code: currency,
                        value: totalAmount,
                    },
                },
            ],
        });

        const response = await this.client.execute(request);
        return response.result;
    }

    async createSubOrder(planId: string, currency: string = "USD") {
        // For SaaS we define prices based on selected plan
        const planPricing: Record<string, { name: string; price: string }> = {
            basic: { name: "Basic Plan", price: "10.00" },
            pro: { name: "Pro Plan", price: "25.00" },
            enterprise: { name: "Enterprise Plan", price: "50.00" },
        };

        if (!planPricing[planId]) {
            throw new Error("Invalid plan ID");
        }

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            application_context: {
                shipping_preference: "NO_SHIPPING", // no address required
            },
            purchase_units: [
                {
                    description: planPricing[planId].name,
                    amount: {
                        currency_code: currency,
                        value: planPricing[planId].price,
                    },
                },
            ],
        });

        const response = await this.client.execute(request);
        return response.result;
    }

    async captureOrder(orderId: string) {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        const response = await this.client.execute(request);
        return response.result;
    }
}
