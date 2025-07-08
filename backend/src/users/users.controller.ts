import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenPayload } from 'src/auth/types/tokens';
import { AuthenticatedUser } from 'src/auth/decorators/user.decorator';
import { UserEntity } from './entities/user.entity';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller({
    version: '1',
    path: 'users',
})
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOkResponse({ type: UserEntity })
    @HttpCode(200)
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @Get()
    async me(
        @AuthenticatedUser() user: AccessTokenPayload,
    ): Promise<UserEntity> {
        return new UserEntity(await this.usersService.findOne(user.sub));
    }

    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @HttpCode(200)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return new UserEntity(
            await this.usersService.update(+id, updateUserDto),
        );
    }

    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @HttpCode(204)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return new UserEntity(await this.usersService.remove(+id));
    }
}
