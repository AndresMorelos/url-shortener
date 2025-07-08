import * as path from 'node:path';
import * as fs from 'node:fs';

export default () => ({
    // API Config
    ENVIRONMENT: process.env.ENVIRONMENT ?? 'development',
    PORT: parseInt(process.env.PORT ?? '3000'),

    //JWT
    JWT_PUBLIC_KEY: fs.readFileSync(
        path.resolve(__dirname, '..', '..', 'jwt-public.key'),
    ),
    JWT_PRIVATE_KEY: fs.readFileSync(
        path.resolve(__dirname, '..', '..', 'jwt-private.key'),
    ),
    JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME ?? '1h',
    JWT_ISSUER: process.env.JWT_ISSUER ?? 'url-shortener',
    // Throttling
    THROTTLE_TTL: parseInt(process.env.THROTTLE_TTL ?? '60000'),
    THROTTLE_LIMIT: parseInt(process.env.THROTTLE_LIMIT ?? '10'),
});
