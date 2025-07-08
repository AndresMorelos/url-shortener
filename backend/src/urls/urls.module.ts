import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [UrlsController],
    providers: [UrlsService],
    imports: [PrismaModule],
    exports: [UrlsService],
})
export class UrlsModule {}
