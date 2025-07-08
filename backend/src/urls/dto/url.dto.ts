import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsNumber, IsUUID } from 'class-validator';

export class Url {
    @IsNumber()
    id?: number;

    @IsUrl()
    @ApiProperty({
        example: 'https://google.com',
    })
    url: string;

    @IsUUID()
    @ApiProperty()
    urlCode: string;

    @IsNumber()
    @ApiProperty()
    visitCount: number;

    createdAt: Date;

    updatedAt: Date;
}
