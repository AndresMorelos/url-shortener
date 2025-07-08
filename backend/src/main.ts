import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import {
    ClassSerializerInterceptor,
    ConsoleLogger,
    ValidationPipe,
    VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new ConsoleLogger({
            prefix: 'UrlShortener',
        }),
    });

    const configService = app.get<ConfigService>(ConfigService);

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.enableVersioning({
        type: VersioningType.URI,
    });
    app.use(helmet());
    app.use(compression());
    app.enableCors({
        allowedHeaders: ['content-type', 'authorization'],
        origin: 'http://localhost:3000',
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe());

    const environment = configService.getOrThrow<string>('ENVIRONMENT');

    if (environment === 'development') {
        const config = new DocumentBuilder()
            .setTitle('Url Shortener')
            .setDescription('The url shortener API description')
            .setVersion('0.1')
            .addBearerAuth()
            .addGlobalResponse({
                status: 500,
                description: 'Internal server error',
            })
            .addGlobalResponse({
                status: 429,
                description: 'ThrottlerException: Too Many Requests',
            })
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('docs', app, document);
    }

    const port = configService.getOrThrow<number>('PORT');

    await app.listen(port);
}

bootstrap().catch(console.error);
