import { Test, TestingModule } from '@nestjs/testing';
import { AuthUser } from '@domain/auth/auth.interface';
import { PetFactory } from '@domain/pets/pet.factory';
import { UpdatePetDTO } from '@domain/pets/dto/update-pet.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdatePetUseCase } from './update-pet.usecase';
import { UserRole } from '@prisma/client';
import { PrismaService } from '@infra/database/services';

describe('UpdatePetUseCase', () => {
    //
    let useCase: UpdatePetUseCase;

    const authUserMock: AuthUser = {
        id: 2,
        email: 'cliente@test.com',
        role: UserRole.CLIENT,
    };

    const prismaServiceMock = {
        pet: {
            findUnique: jest.fn().mockResolvedValue({
                id: 120,
                user_id: authUserMock.id,
                name: 'Beethoven',
            }),
            update: jest.fn().mockResolvedValue(true),
        },
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PetFactory,
                UpdatePetUseCase,
                {
                    provide: PrismaService,
                    useValue: prismaServiceMock,
                },
            ],
        }).compile();
        useCase = module.get<UpdatePetUseCase>(UpdatePetUseCase);
    });

    it('should be update the pet', async () => {
        // arrange
        const petId = 120;
        const updatePetDTO: UpdatePetDTO = {
            name: 'Beethoven',
            birth_date: new Date(2022, 1, 1),
        };

        // act
        await useCase.execute(petId, updatePetDTO, authUserMock);

        // assert
        expect(prismaServiceMock.pet.findUnique).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.pet.update).toHaveBeenCalledTimes(1);
    });

    it('should be thrown a not found exception if pet is not registered', () => {
        // arrange
        prismaServiceMock.pet.findUnique = jest.fn().mockImplementationOnce(null);

        const petId = 120;
        const updatePetDTO: UpdatePetDTO = {
            name: 'Beethoven',
            birth_date: new Date(2022, 1, 1),
        };

        // assert
        expect(useCase.execute(petId, updatePetDTO, authUserMock)).rejects.toThrow(NotFoundException);
    });
});
