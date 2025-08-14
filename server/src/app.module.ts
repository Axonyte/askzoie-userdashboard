import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthenticationModule } from "./modules/authentication/authentication.module";
import { UserModule } from "./modules/user/user.module";
import { PrismaModule } from "./shared/services/prisma/prisma-module.module";

@Module({
    imports: [PrismaModule, AuthenticationModule, UserModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
