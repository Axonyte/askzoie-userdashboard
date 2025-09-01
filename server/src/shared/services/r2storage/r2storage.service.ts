import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
    HttpException,
    HttpStatus,
    Injectable,
    UploadedFile,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TPutBucket } from "./types/PutBucket";

@Injectable()
export class R2storageService {
    constructor(private readonly configService: ConfigService) {}

    async getDocument(path: string) {
        const s3Client = new S3Client({
            region: "apac",
            endpoint: `https://1d60af0524887ac5da70210756f6baeb.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: this.configService.get(
                    "R2_ACCESS_KEY_ID"
                ) as string,
                secretAccessKey: this.configService.get(
                    "R2_SECRET_ACCESS_KEY"
                ) as string,
            },
        });

        const command = new GetObjectCommand({
            Bucket: this.configService.get("R2_BUCKET_NAME"),
            Key: path,
        });

        const url = await getSignedUrl(s3Client, command);

        return url;
    }

    async uploadDocument(file: Express.Multer.File, filedetails: TPutBucket) {
        const s3Client = new S3Client({
            region: "auto", // Cloudflare R2 usually works with "auto"
            endpoint: `https://1d60af0524887ac5da70210756f6baeb.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: this.configService.get(
                    "R2_ACCESS_KEY_ID"
                ) as string,
                secretAccessKey: this.configService.get(
                    "R2_SECRET_ACCESS_KEY"
                ) as string,
            },
        });

        // Derive extension from mimetype
        const extension = file.mimetype.split("/")[1]; // e.g. "png" from "image/png"

        // Ensure fileName has the right extension
        let fileNameWithExt = filedetails.fileName;
        if (
            !fileNameWithExt
                .toLowerCase()
                .endsWith(`.${extension.toLowerCase()}`)
        ) {
            fileNameWithExt = `${fileNameWithExt}.${extension}`;
        }

        const fileURL = `${filedetails.folder.replace(/^\//, "")}/${fileNameWithExt}`;

        const putCommand = new PutObjectCommand({
            Bucket: this.configService.get("R2_BUCKET_NAME"),
            Key: fileURL,
            Body: file.buffer,
            ContentType: file.mimetype, // <-- store correct content type
        });

        const res = await s3Client.send(putCommand);

        if (res.$metadata.httpStatusCode !== 200) {
            throw new HttpException(
                "Unable to Upload Document",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
        console.log(fileURL);

        return fileURL;
    }

    async deleteDocument(filedetails: TPutBucket) {
        const s3Client = new S3Client({
            region: "apac",
            endpoint: `https://cf8b9896a8804491ce4b766343ce3041.r2.cloudflarestorage.com/${filedetails.folder}`,
            credentials: {
                accessKeyId: this.configService.get(
                    "R2_ACCESS_KEY_ID"
                ) as string,
                secretAccessKey: this.configService.get(
                    "R2_SECRET_ACCESS_KEY"
                ) as string,
            },
        });

        const deleteCommand = new DeleteObjectCommand({
            Bucket: this.configService.get("R2_BUCKET_NAME"),
            Key: filedetails.fileName,
        });
        const res = await s3Client.send(deleteCommand);
        console.log(res);

        if (res.$metadata.httpStatusCode !== 204) {
            throw new HttpException(
                "Unable to Delete Document",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
        return;
    }
}
