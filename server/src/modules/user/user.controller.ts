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
    Put,
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

    @Put("profile")
    @UseInterceptors(ClassSerializerInterceptor)
    async updateUserProfile(
        @UserId() userId: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        const user = await this.userService.updateUserDetails(
            userId,
            updateUserDto
        );
        return new UserEntity(user);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.updateUserDetails(id, updateUserDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.userService.remove(id);
    }
}
