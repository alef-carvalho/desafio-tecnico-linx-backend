import { Test, TestingModule } from '@nestjs/testing';
import { CreatePetUseCase } from '@domain/pets/usecases/create-pet.usecase';
import { PetFactory } from '@domain/pets/pet.factory';
import { ConflictException } from '@nestjs/common';
import { AuthUser } from '@domain/auth/auth.interface';
import { CreatePetDTO } from '@domain/pets/dto/create-pet.dto';
import { PetType, UserRole } from '@prisma/client';
import { PrismaService } from '@infra/database/services';

describe('CreatePetUseCase', () => {
    //
    let useCase: CreatePetUseCase;

    const authUserMock: AuthUser = {
        id: 2,
        email: 'cliente@test.com',
        role: UserRole.CLIENT,
    };

    const prismaServiceMock = {
        pet: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Beethoven',
                birth_date: new Date(2020, 1, 1),
                type: PetType.DOG,
            }),
        },
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [PetFactory, { provide: PrismaService, useValue: prismaServiceMock }, CreatePetUseCase],
        }).compile();
        useCase = module.get<CreatePetUseCase>(CreatePetUseCase);
    });

    it('should be create the pet', async () => {
        // arrange
        const createPetDTO: CreatePetDTO = {
            name: 'Beethoven',
            type: PetType.DOG,
            birth_date: new Date(2020, 1, 1),
        };

        // act
        const result = await useCase.execute(createPetDTO, authUserMock);

        // assert
        expect(result.name).toEqual(createPetDTO.name);
        expect(result.birth_date).toEqual(createPetDTO.birth_date);
        expect(result.type).toEqual(createPetDTO.type);
        expect(prismaServiceMock.pet.create).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.pet.findFirst).toHaveBeenCalledTimes(1);
    });

    it('should be thrown a conflict exception if pet is already registered', () => {
        // arrange
        prismaServiceMock.pet.findFirst = jest.fn().mockImplementationOnce(async () => ({ name: 'Beethoven' }));
        const createPetDTO: CreatePetDTO = {
            name: 'Beethoven',
            type: PetType.DOG,
            birth_date: new Date(),
        };

        // assert
        expect(useCase.execute(createPetDTO, authUserMock)).rejects.toThrow(ConflictException);
    });
});
