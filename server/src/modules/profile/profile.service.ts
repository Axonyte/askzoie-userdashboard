import { Injectable } from "@nestjs/common";
import { AllowedDomainsService } from "src/shared/services/allowed-domains/allowed-domains.service";

@Injectable()
export class ProfileService {
    constructor(
        private readonly allowedDomainsService: AllowedDomainsService
    ) {}

    async addDomain(userId: string, origin: string, description?: string) {
        return this.allowedDomainsService.addDomain(
            userId,
            origin,
            description
        );
    }
    async getUserDomains(userId: string) {
        return this.allowedDomainsService.getUserDomains(userId);
    }
}
