import { Body, Controller, Get, Query } from "@nestjs/common";
import { MiscService } from "./misc.service";

@Controller("misc")
export class MiscController {
    constructor(private readonly miscService: MiscService) {}
    @Get("media/signed-url")
    async getSignedUrlForMediaFiles(@Query("fileUrl") fileUrl: string) {
        return this.miscService.getSignedUrlForMediaFiles(fileUrl);
    }
}
