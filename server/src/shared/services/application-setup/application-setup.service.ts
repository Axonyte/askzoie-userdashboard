import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { BotService } from "src/modules/bot/bot.service";
import { defaultBots } from "src/modules/bot/defaultBots";

@Injectable()
export class ApplicationSetupService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly botService: BotService
    ) {}
    async onModuleInit() {
        await this.prismaService.$connect();

        await this.botService.initDefaultBots(defaultBots)
        // await this.botService.addBotPersona
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
