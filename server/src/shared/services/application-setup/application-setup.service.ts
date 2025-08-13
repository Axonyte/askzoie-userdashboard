import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApplicationSetupService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService
    ) {}
    async onModuleInit() {
        await this.prismaService.$connect();
        const user = await this.prismaService.user.findUnique({
            where: {
                email: this.configService.get("ADMIN_EMAIL"),
            },
        });
        // if (!user) {
        //     await this.prismaService.user.create({
        //         data: {
        //             name: "Admin Shipfacet",
        //             company: "Shipfacet",
        //             email: this.configService.get("ADMIN_EMAIL"),
        //             password: hashPassword(
        //                 this.configService.get("ADMIN_PASSWORD")
        //             ),
        //             phone: this.configService.get("ADMIN_CONTACT"),
        //             iam: "ROOT",
        //             userType: "ADMIN",
        //             role: "",
        //             accountStatus: "APPROVED",
        //             userDetails: { commissionPercentage: 30 },
        //         },
        //     });
        //     console.log("Setup Complete.");
        // }
    }
}
