import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig {
    constructor(private config: ConfigService) {}

    getUrl(): string {
        return this.config.get<string>('DATABASE_URL');
    }
}
