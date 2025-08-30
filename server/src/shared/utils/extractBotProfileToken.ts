import { HttpException, HttpStatus } from "@nestjs/common";
import { Request } from "express";

export const extractBotProfileToken = (req: Request) => {
    const token = req.headers["x-bot-profile"];

    if (!token) {
        throw new HttpException(
            "X-Bot-Profile header missing",
            HttpStatus.BAD_REQUEST
        );
    }

    if (Array.isArray(token)) {
        throw new HttpException(
            "Multiple X-Bot-Profile headers provided",
            HttpStatus.BAD_REQUEST
        );
    }

    return token;
};
