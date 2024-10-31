import { CacheService } from '@infra/cache/cache.service';
import { NotFoundException } from '@nestjs/common';
import { FindUserUseCase } from './find-user.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { PrismaService } from '@infra/database/services';

describe('FindUserUseCase', () => {
    //
    let useCase: FindUserUseCase;

    const cacheServiceMock = {
        get: jest.fn().mockResolvedValue(null),
        getKey: jest.fn().mockResolvedValue('test'),
        set: jest.fn().mockResolvedValue(true),
    };

    const prismaServiceMock = {
        user: {
            findFirst: jest.fn().mockResolvedValue({
                id: 120,
                name: 'Matt Johnson',
                email: 'test@test.com',
                role: UserRole.ADMIN,
            }),
        },
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FindUserUseCase,
                { provide: CacheService, useValue: cacheServiceMock },
                { provide: PrismaService, useValue: prismaServiceMock },
            ],
        }).compile();
        useCase = module.get<FindUserUseCase>(FindUserUseCase);
    });

    it('should be find the user', async () => {
        // arrange
        const id = 120;

        // act
        await useCase.execute(id);

        // assert
        expect(cacheServiceMock.get).toHaveBeenCalledTimes(1);
        expect(cacheServiceMock.set).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.user.findFirst).toHaveBeenCalledTimes(1);
    });

    it('should be find the user using cache', async () => {
        // arrange
        const id = 120;
        cacheServiceMock.get = jest.fn().mockImplementationOnce(async () => ({
            id: 120,
            name: 'User Cached',
            email: 'test@test.com',
            role: UserRole.ADMIN,
        }));

        // act
        await useCase.execute(id);

        // assert
        expect(cacheServiceMock.get).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.user.findFirst).toHaveBeenCalledTimes(0);
    });

    it('should be thrown a not found exception if pet is not registered', () => {
        // arrange
        const id = 120;
        prismaServiceMock.user.findFirst = jest.fn().mockImplementationOnce(null);

        // assert
        expect(useCase.execute(id)).rejects.toThrow(NotFoundException);
    });
});
