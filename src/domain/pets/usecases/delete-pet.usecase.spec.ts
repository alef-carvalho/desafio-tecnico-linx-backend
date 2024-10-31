import { AuthUser } from '@domain/auth/auth.interface';
import { UserRole } from '@prisma/client';
import { DeletePetUseCase } from './delete-pet.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@infra/database/services';

describe('DeletePetUseCase', () => {
    //
    let useCase: DeletePetUseCase;

    const authUserMock: AuthUser = {
        id: 2,
        email: 'cliente@test.com',
        role: UserRole.CLIENT,
    };

    const prismaServiceMock = {
        pet: {
            findUnique: jest.fn().mockResolvedValue({ id: 120 }),
            delete: jest.fn().mockResolvedValue(true),
        },
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [DeletePetUseCase, { provide: PrismaService, useValue: prismaServiceMock }],
        }).compile();
        useCase = module.get<DeletePetUseCase>(DeletePetUseCase);
    });

    it('should be delete the pet', async () => {
        // arrange
        const id = 120;

        // act
        await useCase.execute(id, authUserMock);

        // assert
        expect(prismaServiceMock.pet.delete).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.pet.findUnique).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.pet.findUnique).toHaveBeenCalledWith({
            where: { id, user_id: authUserMock.id },
        });
    });
});
