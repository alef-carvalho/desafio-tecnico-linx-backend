import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@infra/database/services';
import { AuthToken, AuthUser } from '@domain/auth/auth.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
    ) {}

    async login(user: AuthUser): Promise<AuthToken> {
        const payload: AuthUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    async validate(email: string, password: string) {
        const user = await this.prismaService.user.findFirst({
            where: {
                email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                password: true,
            },
        });

        if (user && bcrypt.compareSync(password, user.password)) {
            return user;
        }

        throw new UnauthorizedException('Usuário ou senha incorretos');
    }
}
