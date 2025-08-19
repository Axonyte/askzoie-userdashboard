import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { AuthGuard } from "@nestjs/passport";
import { SubscribeDto } from "./dto/subscribe.dto";
import { UserId } from "src/decorators/userId.decorator";

@Controller("subscription")
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    @Get("current")
    async getCurrentSubscription(@UserId() userId: string) {
        return this.subscriptionService.getCurrentSubscription(userId);
    }

    @Post("subscribe")
    async subscribeToPlan(
        @UserId() userId: string,
        @Body() subscribeDto: SubscribeDto
    ) {
        return this.subscriptionService.subscribeToPlan(
            userId,
            subscribeDto.plan
        );
    }

    @Post("claim-free-prompts")
    async claimFreePrompts(@UserId() userId: string) {
        return this.subscriptionService.claimFreePrompts(userId);
    }
}
