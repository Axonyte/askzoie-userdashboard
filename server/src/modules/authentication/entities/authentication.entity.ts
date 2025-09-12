
import { Exclude } from "class-transformer";
import { AccountStatus } from "generated/prisma";

export class AuthEntity {
  id: string;
  name: string;
  email: string;
  accountStatus: AccountStatus;
  createdAt: Date;
  accessToken: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<AuthEntity>) {
    Object.assign(this, partial);
  }
}
