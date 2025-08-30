import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { AllowedDomainsService } from "src/shared/services/allowed-domains/allowed-domains.service";

@Module({
    controllers: [ProfileController],
    providers: [ProfileService, AllowedDomainsService],
})
export class ProfileModule {}
