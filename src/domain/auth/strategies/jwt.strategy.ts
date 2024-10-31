import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfig } from '@infra/config/mappers/jwt.config';
import { AuthUser } from '@domain/auth/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly config: JwtConfig) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.getSecret(),
        });
    }

    async validate(payload: any): Promise<AuthUser> {
        return {
            id: payload.id,
            email: payload.email,
            role: payload.role,
        };
    }
}
