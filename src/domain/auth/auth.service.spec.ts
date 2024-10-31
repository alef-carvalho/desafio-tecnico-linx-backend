import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserRole } from '@prisma/client';
import { PrismaService } from '@infra/database/services';

describe('AuthService', () => {
    //
    let useCase: AuthService;

    const jwtServiceMock = {
        sign: jest.fn().mockResolvedValue(''),
    };

    const prismaServiceMock = {
        user: {
            findFirst: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Matt Johnson',
                email: 'test@test.com',
                password: '$2b$10$lBm6GYcX6FaSTTvn7nMJTe0clkMwjD.N8ZcOwbU1v2i.g0FZfYxs6',
                role: UserRole.ADMIN,
            }),
        },
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: jwtServiceMock,
                },
                {
                    provide: PrismaService,
                    useValue: prismaServiceMock,
                },
            ],
        }).compile();
        useCase = module.get<AuthService>(AuthService);
    });

    it('should be return user if credentials are valid', async () => {
        // arrange
        const email = 'test@test.com';
        const password = '12345678';

        // act
        const user = await useCase.validate(email, password);

        // assert
        expect(user.email).toBe('test@test.com');
        expect(prismaServiceMock.user.findFirst).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.user.findFirst).toBeCalledWith({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true,
            },
        });
    });

    it('should be thrown an authorization exception credentials are invalid', () => {
        // mock
        prismaServiceMock.user.findFirst = jest.fn().mockImplementationOnce(null);

        // arrange
        const email = 'test@test.com';
        const password = '12345678';

        // assert
        expect(useCase.validate(email, password)).rejects.toThrow(UnauthorizedException);
    });
});
