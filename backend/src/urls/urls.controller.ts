import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    NotFoundException,
    Res,
    HttpCode,
    Header,
} from '@nestjs/common';
import { Response } from 'express';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import {
    ApiBearerAuth,
    ApiMovedPermanentlyResponse,
    ApiNoContentResponse,
    ApiResponse,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AuthenticatedUser } from '../auth/decorators/user.decorator';
import { AccessTokenPayload } from '../auth/types/tokens';
import { Public } from '../auth/decorators/public.decorator';
import { UrlEntity } from './entities/url.entity';

@UseGuards(JwtGuard)
@Controller({
    version: '1',
    path: 'urls',
})
export class UrlsController {
    constructor(private readonly urlsService: UrlsService) {}

    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: 'Generate a short Url',
        type: UrlEntity,
    })
    @Post()
    create(
        @AuthenticatedUser() user: AccessTokenPayload,
        @Body() createUrlDto: CreateUrlDto,
    ) {
        return this.urlsService.create(user, createUrlDto);
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: "Returns all users' URLs",
        type: [UrlEntity],
    })
    @Get()
    async findAll(
        @AuthenticatedUser() user: AccessTokenPayload,
    ): Promise<UrlEntity[]> {
        const urls = await this.urlsService.findAll(user);
        return urls.map((url) => new UrlEntity(url));
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
        const { url } = await this.urlsService.findOneByUUId(uuid);

        if (!url) {
            throw new NotFoundException();
        }

        return res.redirect(301, url);
    }

    @ApiBearerAuth()
    @ApiNoContentResponse({ type: UrlEntity })
    @HttpCode(204)
    @Delete(':id')
    async remove(
        @AuthenticatedUser() user: AccessTokenPayload,
        @Param('id') id: string,
    ) {
        return new UrlEntity(await this.urlsService.remove(user, +id));
    }
}
