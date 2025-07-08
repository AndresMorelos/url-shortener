import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload } from '../types/tokens';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        const jwtPublicKey = configService.get<Buffer>('JWT_PUBLIC_KEY');
        if (!jwtPublicKey) {
            throw new Error('JWT public key is not configured');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtPublicKey,
        });
    }

    validate(payload: AccessTokenPayload) {
        return payload;
    }
}
