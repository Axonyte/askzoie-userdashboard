import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from "@nestjs/common";
import { Plan } from "generated/prisma";
import { PrismaService } from "src/shared/services/prisma/prisma.service";

const PLAN_QUOTAS = {
    FREE: 1000,
    STARTER: 5000,
    GROWTH: 15000,
    PREMIUM: 25000,
    ENTERPRISE: Number.MAX_SAFE_INTEGER, // Unlimited
};

@Injectable()
export class SubscriptionService {
    constructor(private readonly prisma: PrismaService) {}

    private calculateNextPeriodEnd(): Date {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }

    async getCurrentSubscription(userId: string) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        promptQuota: true,
                    },
                },
            },
        });

        if (!subscription) {
            throw new NotFoundException("No subscription found for this user");
        }

        return subscription;
    }

    async subscribeToPlan(userId: string, plan: Plan) {
        // Validate user exists
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                subscription: true,
                promptQuota: true,
            },
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const nextPeriodEnd = this.calculateNextPeriodEnd();

        // Start a transaction to update both subscription and quota
        return await this.prisma.$transaction(async (tx) => {
            // Update or create subscription
            const subscription = await tx.subscription.upsert({
                where: { userId },
                update: {
                    plan,
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: nextPeriodEnd,
                    status: "active",
                    canceledAt: null,
                },
                create: {
                    userId,
                    plan,
                    currentPeriodEnd: nextPeriodEnd,
                },
            });

            // Update or create prompt quota
            const promptQuota = await tx.promptQuota.upsert({
                where: { userId },
                update: {
                    monthlyQuota: PLAN_QUOTAS[plan],
                    resetDate: nextPeriodEnd,
                    lastUpdated: new Date(),
                },
                create: {
                    userId,
                    monthlyQuota: PLAN_QUOTAS[plan],
                    resetDate: nextPeriodEnd,
                },
            });

            return {
                subscription,
                promptQuota,
            };
        });
    }

    async initializeFreeSubscription(userId: string) {
        try {
            return await this.subscribeToPlan(userId, "FREE");
        } catch (error) {
            console.log(error);
            throw new BadRequestException(
                "Failed to initialize free subscription"
            );
        }
    }
}
