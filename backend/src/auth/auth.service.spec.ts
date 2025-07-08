import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {
    UnauthorizedException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';

const mockUser = {
    id: 1,
    username: 'testuser',
    password: 'hashedpass',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: null,
    deleted: false,
    deletedAt: null,
};
const mockUserDto = { username: 'testuser', password: 'Password1.' };

jest.mock('bcrypt');

describe('AuthService', () => {
    let service: AuthService;
    let usersService: jest.Mocked<UsersService>;
    let jwtService: jest.Mocked<JwtService>;
    let configService: jest.Mocked<ConfigService>;

    beforeEach(async () => {
        usersService = {
            findOneByUsername: jest.fn(),
            create: jest.fn(),
        } as any;
        jwtService = {
            signAsync: jest.fn(),
        } as any;
        configService = {
            get: jest.fn(),
        } as any;
        (bcrypt.compare as jest.Mock) = jest.fn();
        (bcrypt.hash as jest.Mock) = jest.fn();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: usersService },
                { provide: JwtService, useValue: jwtService },
                { provide: ConfigService, useValue: configService },
            ],
        }).compile();
        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return user if credentials match', async () => {
            usersService.findOneByUsername.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            const result = await service.validateUser('testuser', 'Password1.');
            expect(result).toEqual(mockUser);
        });
        it('should throw if user not found', async () => {
            usersService.findOneByUsername.mockResolvedValue(null);
            await expect(
                service.validateUser('nouser', 'pass'),
            ).rejects.toThrow(UnauthorizedException);
        });
        it('should throw if password does not match', async () => {
            usersService.findOneByUsername.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);
            await expect(
                service.validateUser('testuser', 'wrongpass'),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('signIn', () => {
        it('should return access_token if private key exists', async () => {
            configService.get.mockReturnValue('privateKey');
            jwtService.signAsync.mockResolvedValue('token');
            const result = await service.signIn(mockUser);
            expect(result).toEqual({ access_token: 'token' });
        });
        it('should throw if private key is missing', async () => {
            configService.get.mockReturnValue(undefined);
            await expect(service.signIn(mockUser)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('register', () => {
        it('should throw if user already exists', async () => {
            usersService.findOneByUsername.mockResolvedValue(mockUser);
            await expect(service.register(mockUserDto)).rejects.toThrow(
                BadRequestException,
            );
        });
        it('should hash password, create user, and sign in', async () => {
            usersService.findOneByUsername.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpass');
            usersService.create.mockResolvedValue(mockUser);

            jest.spyOn(service, 'signIn')
                .mockImplementation()
                .mockResolvedValueOnce({
                    access_token: 'token',
                });
            const result = await service.register(mockUserDto);
            expect(bcrypt.hash).toHaveBeenCalledWith(mockUserDto.password, 10);
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(usersService.create).toHaveBeenCalledWith({
                ...mockUserDto,
                password: 'hashedpass',
            });
            expect(result).toEqual({ access_token: 'token' });
        });
    });
});
