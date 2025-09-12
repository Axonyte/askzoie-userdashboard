import { Exclude } from "class-transformer";
import { AccountStatus } from "generated/prisma";

export class UserEntity {
    id: string;
    name: string;
    email: string;
    accountStatus: AccountStatus;
    createdAt: Date;

    @Exclude()
    password: string;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
