import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Url } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UrlEntity implements Url {
    constructor(partial: Partial<UrlEntity>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    id: number;

    @ApiProperty({ required: true })
    url: string;

    @ApiProperty()
    urlCode: string;

    @ApiProperty()
    visitCount: number;

    @ApiHideProperty()
    userId: number | null;

    @ApiProperty()
    deleted: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date | null;
}
