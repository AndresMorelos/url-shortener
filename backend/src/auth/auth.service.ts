import {
    Injectable,
    InternalServerErrorException,
    Logger,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/dto/user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AccessToken } from './types/tokens';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name, { timestamp: true });
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOneByUsername(username);
        if (!user) {
            throw new UnauthorizedException('Credentials does not match');
        }

        const isMatch: boolean = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Credentials does not match');
        }
        return user;
    }

    async signIn(user: User): Promise<AccessToken> {
        const payload = {
            sub: user.id,
            username: user.username,
        };

        const jwtPrivateKey = this.configService.get<string>('jwtPrivateKey');

        if (!jwtPrivateKey) {
            throw new InternalServerErrorException();
        }

        return {
            access_token: await this.jwtService.signAsync(payload, {
                privateKey: jwtPrivateKey,
            }),
        };
    }

    async register(_user: CreateUserDto): Promise<AccessToken> {
        const existingUser = await this.usersService.findOneByUsername(
            _user.username,
        );

        if (existingUser) {
            throw new BadRequestException('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(_user.password, 10);

        const newUser: CreateUserDto = { ..._user, password: hashedPassword };

        const userCreated = await this.usersService.create(newUser);

        return this.signIn(userCreated);
    }
}
