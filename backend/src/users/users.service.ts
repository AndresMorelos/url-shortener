import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    create(createUserDto: CreateUserDto) {
        return this.prisma.user.create({
            data: {
                username: createUserDto.username,
                name: createUserDto.name,
                password: createUserDto.password,
            },
        });
    }

    findOne(id: number) {
        return this.prisma.user.findFirstOrThrow({
            where: {
                id,
            },
        });
    }

    findOneByUsername(username: string) {
        return this.prisma.user.findFirst({ where: { username } });
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return this.prisma.user.update({
            data: {
                username: updateUserDto.username,
                name: updateUserDto.name,
            },
            where: {
                id,
            },
        });
    }

    remove(id: number) {
        return this.prisma.customPrismaClient.user.softDelete({
            id,
        });
    }
}
