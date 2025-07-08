import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotFoundException } from '@nestjs/common';

describe('AppController', () => {
    let appController: AppController;
    let appService: { getHello: jest.Mock; getUrl: jest.Mock };

    beforeEach(async () => {
        appService = {
            getHello: jest.fn().mockReturnValue('Hello World!'),
            getUrl: jest.fn(),
        };
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [{ provide: AppService, useValue: appService }],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.getHello()).toBe('Hello World!');
        });
    });

    describe('findOne', () => {
        it('should redirect to the found url', async () => {
            const uuid = 'abc123';
            const url = 'https://test.com';
            appService.getUrl.mockResolvedValue({ url });
            const res = { redirect: jest.fn() };
            await appController.findOne(uuid, res as any);
            expect(appService.getUrl).toHaveBeenCalledWith(uuid);
            expect(res.redirect).toHaveBeenCalledWith(301, url);
        });

        it('should throw NotFoundException if url is not found', async () => {
            const uuid = 'notfound';
            appService.getUrl.mockResolvedValue({ url: undefined });
            const res = { redirect: jest.fn() };
            await expect(
                appController.findOne(uuid, res as any),
            ).rejects.toThrow(NotFoundException);
            expect(appService.getUrl).toHaveBeenCalledWith(uuid);
            expect(res.redirect).not.toHaveBeenCalled();
        });
    });
});
