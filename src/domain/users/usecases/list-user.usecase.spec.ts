import { UserRole } from '@prisma/client';
import { CacheService } from '@infra/cache/cache.service';
import { PrismaService } from '@infra/database/services';
import { ListUserUserUseCase } from './list-user.usecase';
import { Test, TestingModule } from '@nestjs/testing';

describe('ListUserUserUseCase', () => {
    //
    let useCase: ListUserUserUseCase;

    const cacheServiceMock = {
        get: jest.fn().mockResolvedValue(null),
        getKey: jest.fn().mockResolvedValue('test'),
        set: jest.fn().mockResolvedValue(true),
    };

    const prismaServiceMock = {
        user: {
            count: jest.fn().mockResolvedValue(1),
            findMany: jest.fn().mockResolvedValue([{ id: 1, name: 'Matt Johnson', email: 'test@test.com', role: UserRole.ADMIN }]),
        },
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ListUserUserUseCase,
                { provide: CacheService, useValue: cacheServiceMock },
                { provide: PrismaService, useValue: prismaServiceMock },
            ],
        }).compile();
        useCase = module.get<ListUserUserUseCase>(ListUserUserUseCase);
    });

    it('should be list the users', async () => {
        // arrange
        const page = 1;
        const size = 10;

        // act
        const results = await useCase.execute(page, size);

        // assert
        expect(results.meta.page).toBe(page);
        expect(results.meta.size).toBe(size);
        expect(cacheServiceMock.get).toHaveBeenCalledTimes(1);
        expect(cacheServiceMock.set).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.user.findMany).toHaveBeenCalledTimes(1);
    });

    it('should be find the users using cache', async () => {
        // arrange
        const page = 1;
        const size = 10;
        cacheServiceMock.get = jest.fn().mockImplementationOnce(async () => ({
            data: [
                {
                    id: 1,
                    name: 'Cached User',
                    email: 'test@test.com',
                    role: UserRole.ADMIN,
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
        const results = await useCase.execute(page, size);

        // assert
        expect(results.meta.page).toBe(page);
        expect(results.meta.size).toBe(size);
        expect(cacheServiceMock.get).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.user.findMany).toHaveBeenCalledTimes(0);
    });
});
