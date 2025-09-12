import { Controller, Post, Body } from "@nestjs/common";
import { PaypalService } from "./paypal.service";

@Controller("paypal")
export class PaypalController {
    constructor(private readonly paypalService: PaypalService) {}

    @Post("create-order")
    async createOrder(@Body("amount") amount: string) {
        return this.paypalService.createOrder(amount);
    }

    @Post("capture-order")
    async captureOrder(@Body() body) {
        console.log(body,"================")
        return this.paypalService.captureOrder(body.orderId);
    }
}
