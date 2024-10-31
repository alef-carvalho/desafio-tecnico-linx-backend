import { AuthUser } from '@domain/auth/auth.interface';
import { CacheService } from '@infra/cache/cache.service';
import { ListPetUseCase } from './list-pet.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { PetType, UserRole } from '@prisma/client';
import { PrismaService } from '@infra/database/services';

describe('ListPetUseCase', () => {
    //
    let useCase: ListPetUseCase;

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
            count: jest.fn().mockResolvedValue(1),
            findMany: jest.fn().mockResolvedValue([
                {
                    id: 1,
                    user_id: authUserMock.id,
                    name: 'Beethoven',
                    type: PetType.DOG,
                },
            ]),
        },
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ListPetUseCase,
                { provide: CacheService, useValue: cacheServiceMock },
                { provide: PrismaService, useValue: prismaServiceMock },
            ],
        }).compile();
        useCase = module.get<ListPetUseCase>(ListPetUseCase);
    });

    it('should be list the pets', async () => {
        // arrange
        const page = 1;
        const size = 10;

        // act
        const results = await useCase.execute(page, size, authUserMock);

        // assert
        expect(results.meta.page).toBe(page);
        expect(results.meta.size).toBe(size);
        expect(cacheServiceMock.get).toHaveBeenCalledTimes(1);
        expect(cacheServiceMock.set).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.pet.count).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.pet.findMany).toHaveBeenCalledTimes(1);
    });

    it('should be find the pets using cache', async () => {
        // arrange
        const page = 1;
        const size = 10;
        cacheServiceMock.get = jest.fn().mockImplementationOnce(async () => ({
            data: [
                {
                    id: 1,
                    user_id: authUserMock.id,
                    name: 'Beethoven',
                    type: PetType.DOG,
                },
            ],
            meta: {
                page: 1,
                size: 10,
                total: 1,
                totalPages: 1,
            },
        }));

        // act
        const results = await useCase.execute(page, size, authUserMock);

        // assert
        expect(results.meta.page).toBe(page);
        expect(results.meta.size).toBe(size);
        expect(cacheServiceMock.get).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.pet.count).toHaveBeenCalledTimes(0);
        expect(prismaServiceMock.pet.findMany).toHaveBeenCalledTimes(0);
    });
});
