import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
    IsNotEmpty,
    IsOptional,
    IsDate,
    IsNumber,
    IsString,
    MinLength,
    Matches,
} from 'class-validator';

export class User {
    @IsNumber()
    id?: number;

    @IsOptional()
    @ApiPropertyOptional({
        type: String,
        example: 'Andres Morelos',
    })
    name?: string | null;

    @IsNotEmpty()
    @ApiProperty({
        example: 'user',
    })
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[,.@$!%*?&])[A-Za-z\d,.@$!%*?&]{8,}$/,
        {
            message:
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        },
    )
    @ApiProperty({
        example: 'Password1.',
        description:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and at least 8 characters.',
    })
    password: string;

    @IsDate()
    createdAt?: Date;

    @IsDate()
    updateAt?: Date;
}
