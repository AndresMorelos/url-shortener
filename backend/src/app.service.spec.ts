import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { UrlsService } from './urls/urls.service';

describe('AppService', () => {
    let service: AppService;
    let urlsService: { findOneByUUId: jest.Mock };

    beforeEach(async () => {
        urlsService = {
            findOneByUUId: jest.fn(),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppService,
                { provide: UrlsService, useValue: urlsService },
            ],
        }).compile();
        service = module.get<AppService>(AppService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('getHello should return "Hello World!"', () => {
        expect(service.getHello()).toBe('Hello World!');
    });

    it('getUrl should delegate to urlsService.findOneByUUId', async () => {
        urlsService.findOneByUUId.mockResolvedValue({
            url: 'https://test.com',
        });
        const result = await service.getUrl('uuid123');
        expect(urlsService.findOneByUUId).toHaveBeenCalledWith('uuid123');
        expect(result).toEqual({ url: 'https://test.com' });
    });
});
