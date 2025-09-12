import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AllowedDomainsService {
    constructor(private prisma: PrismaService) {}

    async addDomain(userId: string, origin: string, description?: string) {
        return this.prisma.allowedDomains.create({
            data: {
                origin,
                description,
                userId,
            },
        });
    }

    async removeDomain(origin: string) {
        return this.prisma.allowedDomains.delete({
            where: { origin },
        });
    }

    async getUserDomains(userId: string) {
        return this.prisma.allowedDomains.findMany({
            where: { userId },
        });
    }

    async getAllEnabledOrigins() {
        return (
            await this.prisma.allowedDomains.findMany({
                select: { origin: true },
            })
        ).map((o) => o.origin);
    }
}
