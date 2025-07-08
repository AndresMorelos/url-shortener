import { Injectable } from '@nestjs/common';
import { UrlsService } from './urls/urls.service';

@Injectable()
export class AppService {
    constructor(private urlsService: UrlsService) {}

    getHello(): string {
        return 'Hello World!';
    }

    getUrl(uuid: string) {
        return this.urlsService.findOneByUUId(uuid);
    }
}
