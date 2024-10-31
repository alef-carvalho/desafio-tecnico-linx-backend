import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfig {
    constructor(protected config: ConfigService) {}

    getHost(): string {
        return this.config.get<string>('REDIS_HOST');
    }

    getPort(): number {
        return this.config.get<number>('REDIS_PORT');
    }

    getPassword(): string {
        return this.config.get<string>('REDIS_PASSWORD');
    }
}
