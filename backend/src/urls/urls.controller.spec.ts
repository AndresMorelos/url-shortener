import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { AccessTokenPayload } from 'src/auth/types/tokens';
import { CreateUrlDto } from './dto/create-url.dto';
import { NotFoundException } from '@nestjs/common';
import type { Response } from 'express';

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

const urlsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneByUUId: jest.fn(),
    remove: jest.fn(),
};

describe('UrlsController', () => {
    let urlController: UrlsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UrlsController],
            providers: [{ provide: UrlsService, useValue: urlsServiceMock }],
        }).compile();

        urlController = module.get<UrlsController>(UrlsController);

        urlsServiceMock.create.mockClear();
        urlsServiceMock.findAll.mockClear();
        urlsServiceMock.findOneByUUId.mockClear();
        urlsServiceMock.remove.mockClear();
    });

    it('should be defined', () => {
        expect(urlController).toBeDefined();
    });

    describe('create', () => {
        it('should call urlsService.create and return result', async () => {
            urlsServiceMock.create.mockResolvedValue(mockUrl);
            const result = await urlController.create(
                mockUser,
                mockCreateUrlDto,
            );
            expect(urlsServiceMock.create).toHaveBeenCalledWith(
                mockUser,
                mockCreateUrlDto,
            );
            expect(result).toEqual(mockUrl);
        });
    });

    describe('findAll', () => {
        it('should return all urls for a user', async () => {
            urlsServiceMock.findAll.mockResolvedValue([mockUrl]);
            const result = await urlController.findAll(mockUser);
            expect(urlsServiceMock.findAll).toHaveBeenCalledWith(mockUser);
            expect(result).toEqual([mockUrl]);
        });
    });

    describe('findOne', () => {
        it('should redirect to the url if found', async () => {
            urlsServiceMock.findOneByUUId.mockResolvedValue({
                url: 'https://test.com',
            });
            const res = { redirect: jest.fn() } as unknown as Response;
            await urlController.findOne('abc123', res);
            expect(urlsServiceMock.findOneByUUId).toHaveBeenCalledWith(
                'abc123',
            );

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(res.redirect).toHaveBeenCalledWith(301, 'https://test.com'); // I need to test the mock
        });
        it('should throw NotFoundException if url not found', async () => {
            urlsServiceMock.findOneByUUId.mockResolvedValue({ url: undefined });
            const res = { redirect: jest.fn() } as any;
            await expect(
                urlController.findOne('notfound', res),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should call urlsService.remove and return result', async () => {
            urlsServiceMock.remove.mockResolvedValue({
                ...mockUrl,
                deleted: true,
            });
            const result = await urlController.remove(mockUser, '1');
            expect(urlsServiceMock.remove).toHaveBeenCalledWith(mockUser, 1);
            expect(result).toEqual({ ...mockUrl, deleted: true });
        });
    });
});
