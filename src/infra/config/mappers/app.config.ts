import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig {
    constructor(private config: ConfigService) {}

    getEnv(): string {
        return this.config.get<string>('APP_ENV', 'development');
    }

    getPort(): number {
        return this.config.get<number>('APP_PORT', 3001);
    }

    isLocal(): boolean {
        return this.getEnv() === 'local';
    }

    isProduction(): boolean {
        return this.getEnv() === 'production';
    }

    isStaging(): boolean {
        return this.getEnv() === 'staging';
    }
}
