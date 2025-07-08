import { User } from './user.dto';
import { PickType } from '@nestjs/swagger';

export class LoginUserDto extends PickType(User, ['username', 'password']) {}
