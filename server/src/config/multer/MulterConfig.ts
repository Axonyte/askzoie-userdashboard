import { HttpException, HttpStatus } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import * as multer from "multer";

/**
 * Returns a Multer fileFilter function that only accepts files with mimetypes in the allowed list.
 * If allowedMimeTypes is ["*"], all files are accepted.
 * @param allowedMimeTypes Array of mimetypes to allow (e.g. ['image/png', 'application/pdf']) or ["*"] to allow all
 */
export function fileFilterWithAllowedTypes(allowedMimeTypes: string[] = ["*"]) {
    return (req, file, callback) => {
        if (allowedMimeTypes.length === 1 && allowedMimeTypes[0] === "*") {
            // Accept all files
            return callback(null, true);
        }
        if (
            allowedMimeTypes.length > 0 &&
            !allowedMimeTypes.includes(file.mimetype)
        ) {
            return callback(
                new HttpException(
                    `Files of type ${file.mimetype} are not allowed! Allowed types: ${allowedMimeTypes.join(", ")}`,
                    HttpStatus.BAD_REQUEST
                ),
                false
            );
        }
        callback(null, true); // Accept the file
    };
}

// Default: accept all files (using ["*"])
export const multerImageOptions: MulterOptions = {
    storage: multer.memoryStorage(),
    limits: { fileSize: 900000 }, // ~900 KB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"), false);
        }
    },
};
/**
 * Example usage in a controller:
 *
 * import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
 * import { FileInterceptor } from '@nestjs/platform-express';
 * import { multerConfigOptions, fileFilterWithAllowedTypes } from 'src/config/multer/MulterConfig';
 *
 * @Controller('upload')
 * export class UploadController {
 *   // Accept all files
 *   @Post('any')
 *   @UseInterceptors(FileInterceptor('file', multerConfigOptions))
 *   uploadAnyFile(@UploadedFile() file: Express.Multer.File) {
 *     return { filename: file.originalname, mimetype: file.mimetype };
 *   }
 *
 *   // Allow only images (e.g., png and jpeg)
 *   @Post('images-only')
 *   @UseInterceptors(FileInterceptor('file', {
 *     ...multerConfigOptions,
 *     fileFilter: fileFilterWithAllowedTypes(['image/png', 'image/jpeg']),
 *   }))
 *   uploadImagesOnly(@UploadedFile() file: Express.Multer.File) {
 *     return { filename: file.originalname, mimetype: file.mimetype };
 *   }
 *
 *   // Allow only pdf files
 *   @Post('pdf-only')
 *   @UseInterceptors(FileInterceptor('file', {
 *     ...multerConfigOptions,
 *     fileFilter: fileFilterWithAllowedTypes(['application/pdf']),
 *   }))
 *   uploadPdfOnly(@UploadedFile() file: Express.Multer.File) {
 *     return { filename: file.originalname, mimetype: file.mimetype };
 *   }
 * }
 */
