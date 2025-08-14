import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    ClassSerializerInterceptor,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserId } from "src/decorators/userId.decorator";
import { UserEntity } from "./entities/user.entity";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get("user-details")
    @UseInterceptors(ClassSerializerInterceptor)
    async fetchUserDetails(@UserId() userId: string) {
        const user = await this.userService.fetchUserDetails(userId);
        return new UserEntity(user);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.userService.remove(id);
    }
}
