import { User } from './user.dto';
import { PickType } from '@nestjs/swagger';

export class CreateUserDto extends PickType(User, [
    'username',
    'name',
    'password',
]) {}
