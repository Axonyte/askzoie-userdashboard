import { AccountStatus } from "generated/prisma";
import { JwtPayload } from "jsonwebtoken";

export interface TUserPayload extends JwtPayload {
    userId: string;
    name: string;
    email: string;
    accountStatus: AccountStatus;
}
