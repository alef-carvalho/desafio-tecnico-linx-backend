import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfig {
    constructor(private config: ConfigService) {}

    getSecret(): string {
        return this.config.get('JWT_SECRET');
    }

    getExpiryTime(): string {
        return this.config.get('JWT_EXPIRE_TIME');
    }
}
