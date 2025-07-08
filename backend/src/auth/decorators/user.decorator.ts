import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenPayload } from '../types/tokens';

export const AuthenticatedUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx
            .switchToHttp()
            .getRequest<{ user: AccessTokenPayload }>();
        return request.user;
    },
);
