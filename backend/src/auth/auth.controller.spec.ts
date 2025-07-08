import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { RegisterResponseDTO } from './dto/register-response.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/dto/user.dto';

const mockAuthService = {
    signIn: jest.fn(),
    register: jest.fn(),
};

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        mockAuthService.register.mockClear();
        mockAuthService.signIn.mockClear();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('signIn', () => {
        it('should return LoginResponseDTO on success', async () => {
            const user: User = {
                id: 1,
                username: 'testuser',
                password: 'hashed',
                name: 'Test User',
                createdAt: new Date(),
                updateAt: new Date(),
            };
            const loginResponse: LoginResponseDTO = { access_token: 'token' };
            mockAuthService.signIn.mockResolvedValue(loginResponse);
            const req = { user };
            const result = await controller.signIn(req);
            expect(mockAuthService.signIn).toHaveBeenCalledWith(user);
            expect(result).toEqual(loginResponse);
        });

        it('should return UnauthorizedException on error', async () => {
            const user: User = {
                id: 1,
                username: 'testuser',
                password: 'hashed',
                name: 'Test User',
                createdAt: new Date(),
                updateAt: new Date(),
            };
            mockAuthService.signIn.mockResolvedValue(
                new UnauthorizedException(),
            );
            const req = { user };
            const result = await controller.signIn(req);
            expect(result).toBeInstanceOf(UnauthorizedException);
        });
    });

    describe('signUp', () => {
        it('should return RegisterResponseDTO on success', async () => {
            const dto: CreateUserDto = {
                username: 'testuser',
                password: 'pass',
                name: 'Test User',
            };
            const registerResponse: RegisterResponseDTO = {
                access_token: 'token',
            };
            mockAuthService.register.mockResolvedValue(registerResponse);
            const result = await controller.signUp(dto);
            expect(mockAuthService.register).toHaveBeenCalledWith(dto);
            expect(result).toEqual(registerResponse);
        });

        it('should return BadRequestException on error', async () => {
            const dto: CreateUserDto = {
                username: 'testuser',
                password: 'pass',
                name: 'Test User',
            };
            mockAuthService.register.mockResolvedValue(
                new BadRequestException(),
            );
            const result = await controller.signUp(dto);
            expect(result).toBeInstanceOf(BadRequestException);
        });
    });
});
