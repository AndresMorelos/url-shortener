import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deleted: boolean;

    @ApiProperty()
    deletedAt: Date | null;

    @ApiProperty({ required: false })
    name: string | null;

    @ApiProperty()
    username: string;

    @Exclude()
    @ApiHideProperty()
    password: string;
}
