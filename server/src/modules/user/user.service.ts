import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "src/shared/services/prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        return await this.prisma.user.create({
            data: createUserDto,
        });
    }

    async findAll() {
        return await this.prisma.user.findMany();
    }

    async fetchUserDetails(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new NotFoundException("User Not Found");
        }
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        return await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }

    async remove(id: string) {
        return await this.prisma.user.delete({
            where: { id },
        });
    }
}
