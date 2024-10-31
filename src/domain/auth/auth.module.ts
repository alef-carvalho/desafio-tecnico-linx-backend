import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtGuard } from './guards/jwt.guard';
import { RoleGuard } from './guards/role.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { JwtConfig } from '@infra/config/mappers/jwt.config';
import { JwtModuleOptions } from '@nestjs/jwt';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [JwtConfig],
            useFactory: (config: JwtConfig): JwtModuleOptions => ({
                secret: config.getSecret(),
                signOptions: {
                    expiresIn: config.getExpiryTime(),
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalStrategy, { provide: APP_GUARD, useClass: JwtGuard }, { provide: APP_GUARD, useClass: RoleGuard }],
})
export class AuthModule {}
