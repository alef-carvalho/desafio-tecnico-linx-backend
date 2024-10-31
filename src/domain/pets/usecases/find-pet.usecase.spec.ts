import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CacheService } from '@infra/cache/cache.service';
import { FindPetUseCase } from './find-pet.usecase';
import { AuthUser } from '@domain/auth/auth.interface';
import { PetType, UserRole } from '@prisma/client';
import { PrismaService } from '@infra/database/services';

describe('FindPetUseCase', () => {
    //
    let useCase: FindPetUseCase;

    const authUserMock: AuthUser = {
        id: 2,
        email: 'cliente@test.com',
        role: UserRole.CLIENT,
    };

    const cacheServiceMock = {
        get: jest.fn().mockResolvedValue(null),
        getKey: jest.fn().mockResolvedValue('test'),
        set: jest.fn().mockResolvedValue(true),
    };

    const prismaServiceMock = {
        pet: {
            findUnique: jest.fn().mockResolvedValue({
                id: 120,
                user_id: authUserMock.id,
                name: 'Beethoven',
                type: PetType.DOG,
            }),
        },
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FindPetUseCase,
                { provide: CacheService, useValue: cacheServiceMock },
                { provide: PrismaService, useValue: prismaServiceMock },
            ],
        }).compile();
        useCase = module.get<FindPetUseCase>(FindPetUseCase);
    });

    it('should be find the pet', async () => {
        // arrange
        const id = 120;

        // act
        await useCase.execute(id, authUserMock);

        // assert
        expect(cacheServiceMock.get).toHaveBeenCalledTimes(1);
        expect(cacheServiceMock.set).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.pet.findUnique).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.pet.findUnique).toHaveBeenCalledWith({
            where: { id, user_id: authUserMock.id },
        });
    });

    it('should be find the pet using cache', async () => {
        // arrange
        const id = 120;
        cacheServiceMock.get = jest.fn().mockImplementationOnce(async () => ({
            id: 120,
            user_id: authUserMock.id,
            name: 'Beethoven',
            type: PetType.DOG,
        }));

        // act
        await useCase.execute(id, authUserMock);

        // assert
        expect(cacheServiceMock.get).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.pet.findUnique).toHaveBeenCalledTimes(0);
    });

    it('should be thrown a not found exception if pet is not registered', () => {
        // arrange
        const id = 120;
        prismaServiceMock.pet.findUnique = jest.fn().mockImplementationOnce(null);

        // assert
        expect(useCase.execute(id, authUserMock)).rejects.toThrow(NotFoundException);
    });

    it('should be thrown a not found exception if pet is not ownered by user', () => {
        // arrange
        const id = 120;
        prismaServiceMock.pet.findUnique = jest.fn().mockImplementationOnce(async () => {
            return {
                id: 120,
                user_id: 76, // other aleatory user
                name: 'Beethoven',
                type: PetType.DOG,
            };
        });

        // assert
        expect(useCase.execute(id, authUserMock)).rejects.toThrow(NotFoundException);
    });
});
