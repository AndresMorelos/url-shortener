import {
    Body,
    Controller,
    Post,
    UseGuards,
    Request,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponseDTO } from './dto/login-response.dto';
import { RegisterResponseDTO } from './dto/register-response.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/dto/user.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local.guard';

@Public()
@Controller({
    version: '1',
    path: 'auth',
})
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @ApiOperation({ summary: 'Login' })
    @ApiResponse({ status: 200, description: 'User logged in successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBody({ type: LoginUserDto })
    @Post('login')
    async signIn(
        @Request() req: { user: User },
    ): Promise<LoginResponseDTO | UnauthorizedException> {
        return this.authService.signIn(req.user);
    }

    @ApiResponse({ status: 201, description: 'User created' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @Post('signUp')
    async signUp(
        @Body() registerBody: CreateUserDto,
    ): Promise<RegisterResponseDTO | BadRequestException> {
        return await this.authService.register(registerBody);
    }
}
