import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { PrismaService } from '../prisma/prisma.service';
import { AccessTokenPayload } from '../auth/types/tokens';
import { CreateUrlDto } from './dto/create-url.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const mockUser: AccessTokenPayload = {
    sub: 1,
    username: 'testuser',
    iat: new Date(),
    exp: new Date(),
};
const mockUrl = {
    id: 1,
    url: 'https://test.com',
    urlCode: 'abc123',
    visitCount: 0,
    User: { id: 1 },
};
const mockCreateUrlDto: CreateUrlDto = { url: 'https://test.com' };

const prismaMock = {
    url: {
        create: jest.fn(),
        update: jest.fn(),
    },
    customPrismaClient: {
        url: {
            findMany: jest.fn(),
            softDelete: jest.fn(),
        },
    },
};

describe('UrlsService', () => {
    let urlsService: UrlsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UrlsService,
                { provide: PrismaService, useValue: prismaMock },
            ],
        }).compile();
        urlsService = module.get<UrlsService>(UrlsService);

        prismaMock.customPrismaClient.url.findMany.mockClear();
        prismaMock.customPrismaClient.url.softDelete.mockClear();
        prismaMock.url.create.mockClear();
        prismaMock.url.update.mockClear();
    });

    it('should be defined', () => {
        expect(urlsService).toBeDefined();
    });

    describe('create', () => {
        it('should create a new url', async () => {
            prismaMock.url.create.mockResolvedValue(mockUrl);
            const result = await urlsService.create(mockUser, mockCreateUrlDto);
            expect(prismaMock.url.create).toHaveBeenCalled();
            expect(result).toEqual(mockUrl);
        });
    });

    describe('findAll', () => {
        it('should return all urls for a user', async () => {
            prismaMock.customPrismaClient.url.findMany.mockResolvedValue([
                mockUrl,
            ]);
            const result = await urlsService.findAll(mockUser);
            expect(
                prismaMock.customPrismaClient.url.findMany,
            ).toHaveBeenCalledWith({
                orderBy: [{ id: 'asc' }],
                where: { User: { id: mockUser.sub } },
            });
            expect(result).toEqual([mockUrl]);
        });
    });

    describe('findOneByUUId', () => {
        it('should increment visitCount and return url', async () => {
            prismaMock.url.update.mockResolvedValue({
                url: 'https://test.com',
            });
            const result = await urlsService.findOneByUUId('abc123');
            expect(prismaMock.url.update).toHaveBeenCalled();
            expect(result).toEqual({ url: 'https://test.com' });
        });

        it('should return { url: undefined } if not found (P2025)', async () => {
            const databaseError = new PrismaClientKnownRequestError('Test', {
                code: 'P2025',
                clientVersion: 'test',
            });
            prismaMock.url.update.mockRejectedValue(databaseError);
            const result = await urlsService.findOneByUUId('notfound');
            expect(result).toEqual({ url: undefined });
        });

        it('should throw error if not P2025', async () => {
            prismaMock.url.update.mockRejectedValue(new Error('other error'));
            await expect(urlsService.findOneByUUId('err')).rejects.toThrow(
                'other error',
            );
        });
    });

    describe('remove', () => {
        it('should call softDelete with correct params', async () => {
            prismaMock.customPrismaClient.url.softDelete.mockResolvedValue({
                ...mockUrl,
                deleted: true,
            });
            const result = await urlsService.remove(mockUser, 1);
            expect(
                prismaMock.customPrismaClient.url.softDelete,
            ).toHaveBeenCalledWith({ userId: mockUser.sub, id: 1 });
            expect(result).toEqual({ ...mockUrl, deleted: true });
        });
    });
});
