import { Injectable } from '@nestjs/common';
import { RedisConfig } from './redis.config';

@Injectable()
export class CacheConfig extends RedisConfig {
    getTTL(): number {
        return parseInt(this.config.get('CACHE_TTL'));
    }
}
