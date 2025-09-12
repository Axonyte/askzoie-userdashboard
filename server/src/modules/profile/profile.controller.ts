import { Body, Controller, Get, Post } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { AddDomainDto } from "./dto/add-domain.dto";
import { UserId } from "src/decorators/userId.decorator";

@Controller("profile")
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Post("domains")
    async addDomain(@UserId() userId: string, @Body() dto: AddDomainDto) {
        return this.profileService.addDomain(
            userId,
            dto.origin,
            dto.description
        );
    }

    @Get("domains")
    async fetchMyDomains(@UserId() userId: string) {
        return this.profileService.getUserDomains(userId);
    }
}
