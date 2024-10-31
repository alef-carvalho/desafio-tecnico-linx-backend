import { Global, Module } from '@nestjs/common';
import { ConfigSchema } from '@infra/config/schemas/config.schema';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';
import { AppConfig } from '@infra/config/mappers/app.config';
import { CacheConfig } from '@infra/config/mappers/cache.config';
import { DatabaseConfig } from '@infra/config/mappers/database.config';
import { RedisConfig } from '@infra/config/mappers/redis.config';
import { JwtConfig } from '@infra/config/mappers/jwt.config';

const services = [AppConfig, CacheConfig, DatabaseConfig, JwtConfig, RedisConfig];

@Global()
@Module({
    imports: [
        BaseConfigModule.forRoot({
            isGlobal: true,
            validationSchema: ConfigSchema,
        }),
    ],
    exports: services,
    providers: services,
})
export class ConfigModule {}
