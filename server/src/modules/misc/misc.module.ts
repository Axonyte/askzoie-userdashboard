import { Module } from "@nestjs/common";
import { MiscService } from "./misc.service";
import { MiscController } from "./misc.controller";
import { R2storageService } from "src/shared/services/r2storage/r2storage.service";

@Module({
    controllers: [MiscController],
    providers: [MiscService, R2storageService],
})
export class MiscModule {}
