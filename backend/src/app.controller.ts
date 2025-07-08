import {
    Controller,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Res,
    Header,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { ApiMovedPermanentlyResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Public()
    @ApiMovedPermanentlyResponse({
        description: 'Redirect to the URL',
    })
    @HttpCode(301)
    @Header('Cache-Control', 'no-store') // Needed to count every visit, if not sent the browser will cache the redirect url and redirect by it self
    @Get(':uuid')
    async findOne(
        @Param('uuid') uuid: string,
        @Res() res: Response,
    ): Promise<void> {
        const { url } = await this.appService.getUrl(uuid);

        if (!url) {
            throw new NotFoundException();
        }

        return res.redirect(301, url);
    }
}
