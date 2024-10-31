import { createHash } from 'node:crypto';
import { Cache } from 'cache-manager';
import { CacheConfig } from '@infra/config/mappers/cache.config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
    constructor(
        @Inject(CACHE_MANAGER) private cache: Cache,
        private readonly config: CacheConfig,
    ) {}

    get<T = any>(key: string): Promise<T> {
        return this.cache.get(key);
    }

    set<T = any>(key: string, value: T, ttl?: number) {
        return this.cache.set(key, value, ttl ?? this.config.getTTL());
    }

    delete(key: string) {
        return this.cache.del(key);
    }

    reset() {
        return this.cache.reset();
    }

    getKey(caller: string, args: any): string {
        return caller + ':' + createHash('sha256').update(JSON.stringify(args)).digest('hex');
    }
}
