import { CacheService } from './cache.service';
import { Global, Module } from '@nestjs/common';
import { CacheConfig } from '@infra/config/mappers/cache.config';
import { CacheModule as BaseCacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
    imports: [
        BaseCacheModule.registerAsync({
            inject: [CacheConfig],
            useFactory: (config: CacheConfig) => ({
                ttl: config.getTTL(),
            }),
        }),
    ],
    exports: [CacheService],
    providers: [CacheService],
})
export class CacheModule {}
