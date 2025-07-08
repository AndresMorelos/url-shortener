import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const mockUser = {
    id: 1,
    username: 'testuser',
    name: 'Test User',
    password: 'hashedpass',
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
    deletedAt: null,
};
const mockCreateUserDto: CreateUserDto = {
    username: 'testuser',
    name: 'Test User',
    password: 'Password1.',
};
const mockUpdateUserDto: UpdateUserDto = {
    username: 'updateduser',
    name: 'Updated User',
};

const prismaMock = {
    user: {
        create: jest.fn(),
        findFirstOrThrow: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
    },
    customPrismaClient: {
        user: {
            softDelete: jest.fn(),
        },
    },
};

describe('UsersService', () => {
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);

        prismaMock.user.findFirstOrThrow.mockClear();
        prismaMock.user.findFirst.mockClear();
        prismaMock.user.update.mockClear();
        prismaMock.user.create.mockClear();
        prismaMock.customPrismaClient.user.softDelete.mockClear();
    });

    it('should be defined', () => {
        expect(usersService).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            prismaMock.user.create.mockResolvedValue(mockUser);
            const result = await usersService.create(mockCreateUserDto);
            expect(prismaMock.user.create).toHaveBeenCalledWith({
                data: {
                    username: mockCreateUserDto.username,
                    name: mockCreateUserDto.name,
                    password: mockCreateUserDto.password,
                },
            });
            expect(result).toEqual(mockUser);
        });
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            prismaMock.user.findFirstOrThrow.mockResolvedValue(mockUser);
            const result = await usersService.findOne(1);
            expect(prismaMock.user.findFirstOrThrow).toHaveBeenCalledWith({
                where: { id: 1 },
            });
            expect(result).toEqual(mockUser);
        });
    });

    describe('findOneByUsername', () => {
        it('should return a user by username', async () => {
            prismaMock.user.findFirst.mockResolvedValue(mockUser);
            const result = await usersService.findOneByUsername('testuser');
            expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
                where: { username: 'testuser' },
            });
            expect(result).toEqual(mockUser);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            prismaMock.user.update.mockResolvedValue({
                ...mockUser,
                ...mockUpdateUserDto,
            });
            const result = await usersService.update(1, mockUpdateUserDto);
            expect(prismaMock.user.update).toHaveBeenCalledWith({
                data: {
                    username: mockUpdateUserDto.username,
                    name: mockUpdateUserDto.name,
                },
                where: { id: 1 },
            });
            expect(result).toEqual({ ...mockUser, ...mockUpdateUserDto });
        });
    });

    describe('remove', () => {
        it('should call softDelete with correct params', async () => {
            prismaMock.customPrismaClient.user.softDelete.mockResolvedValue({
                ...mockUser,
                deleted: true,
            });
            const result = await usersService.remove(1);
            expect(
                prismaMock.customPrismaClient.user.softDelete,
            ).toHaveBeenCalledWith({ id: 1 });
            expect(result).toEqual({ ...mockUser, deleted: true });
        });
    });
});
