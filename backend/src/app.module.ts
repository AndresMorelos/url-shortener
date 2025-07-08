import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

// Config
import config from './config/configuration';

// Controllers
import { AppController } from './app.controller';

// Services
import { AppService } from './app.service';

// Nest Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { UrlsModule } from './urls/urls.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config],
            isGlobal: true,
        }),
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => [
                {
                    ttl: config.getOrThrow<number>('THROTTLE_TTL'),
                    limit: config.getOrThrow<number>('THROTTLE_LIMIT'),
                },
            ],
        }),
        PrismaModule,
        AuthModule,
        UsersModule,
        UrlsModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
