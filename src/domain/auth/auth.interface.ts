import { Request } from 'express';
import { ApiProperty } from '@nestjs/swagger';

export interface AuthUser {
    id: number;
    email: string;
    role: string;
}

export interface AuthRequest extends Request {
    user: AuthUser;
}

export class AuthToken {
    @ApiProperty()
    accessToken: string;
}
