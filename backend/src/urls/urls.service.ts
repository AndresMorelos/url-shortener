import { Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccessTokenPayload } from 'src/auth/types/tokens';
import ShortUniqueId from 'short-unique-id';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UrlsService {
    constructor(private prisma: PrismaService) {}

    create(user: AccessTokenPayload, createUrlDto: CreateUrlDto) {
        const urlUuid = new ShortUniqueId({ length: 10 });
        return this.prisma.url.create({
            data: {
                url: createUrlDto.url,
                urlCode: urlUuid.rnd(),
                visitCount: 0,
                User: {
                    connect: {
                        id: user.sub,
                    },
                },
            },
        });
    }

    findAll(user: AccessTokenPayload) {
        return this.prisma.customPrismaClient.url.findMany({
            orderBy: [
                {
                    id: 'asc',
                },
            ],
            where: {
                User: {
                    id: user.sub,
                },
            },
        });
    }

    findOne(id: string) {
        return `This action returns a #${id} url`;
    }

    async findOneByUUId(uuid: string) {
        try {
            const response = await this.prisma.url.update({
                where: {
                    urlCode: uuid,
                    deleted: false,
                },
                data: {
                    visitCount: {
                        increment: 1,
                    },
                },
                select: {
                    url: true,
                },
            });

            return response;
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                return { url: undefined };
            }

            throw error;
        }
    }

    remove(user: AccessTokenPayload, id: number) {
        console.log(this.prisma);
        return this.prisma.customPrismaClient.url.softDelete({
            userId: user.sub,
            id,
        });
    }
}
