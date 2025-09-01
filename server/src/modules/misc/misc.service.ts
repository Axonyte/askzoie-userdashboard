import { Injectable } from "@nestjs/common";
import { R2storageService } from "src/shared/services/r2storage/r2storage.service";

@Injectable()
export class MiscService {
    constructor(private readonly r2StorageService: R2storageService) {}
    async getSignedUrlForMediaFiles(fileUrl: string) {
        const { fileName, folder } = this.extractFileDetails(fileUrl);
        return await this.r2StorageService.getDocument(fileUrl);
    }
    private extractFileDetails(fileUrl: string) {
        const lastSlashIndex = fileUrl.lastIndexOf("/");

        if (lastSlashIndex === -1) {
            return { folder: "", fileName: fileUrl };
        }

        return {
            folder: fileUrl.substring(0, lastSlashIndex),
            fileName: fileUrl.substring(lastSlashIndex + 1),
        };
    }
}
