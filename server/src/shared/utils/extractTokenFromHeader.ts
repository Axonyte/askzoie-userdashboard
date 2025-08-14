import { HttpException, HttpStatus } from "@nestjs/common";
import { Request } from "express";

export const extractTokenFromHeader = (req: Request) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new HttpException(
      "Authorization Header Missing",
      HttpStatus.NOT_FOUND
    );
  }
  if (!authorization.startsWith("Bearer ")) {
    throw new HttpException(
      "Incorrect format of the auth token",
      HttpStatus.BAD_REQUEST
    );
  }
  const token = authorization.split(" ")[1];
  return token;
};