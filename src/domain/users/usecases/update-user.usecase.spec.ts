import { UserRole } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserUseCase } from './update-user.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserDTO } from '@domain/users/dto/update-user.dto';
import { PrismaService } from '@infra/database/services';

describe('UpdateUserUseCase', () => {
    //
    let useCase: UpdateUserUseCase;

    const prismaServiceMock = {
        user: {
            findUnique: jest.fn().mockResolvedValue({
                id: 120,
                name: 'Usuário Teste',
                role: UserRole.ADMIN,
                email: 'admin@test.com',
                password: '12345678',
            }),
            update: jest.fn().mockResolvedValue(true),
        },
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdateUserUseCase,
                {
                    provide: PrismaService,
                    useValue: prismaServiceMock,
                },
            ],
        }).compile();
        useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    });

    it('should be update the user', async () => {
        // arrange
        const id = 120;
        const updateUserDTO: UpdateUserDTO = {
            name: 'Usuário Teste EDT',
            email: 'test2@test.com',
        };

        // act
        await useCase.execute(id, updateUserDTO);

        // assert
        expect(prismaServiceMock.user.findUnique).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.user.update).toHaveBeenCalledTimes(1);
    });

    it('should be thrown a not found exception if user is not registered', () => {
        // arrange
        prismaServiceMock.user.findUnique = jest.fn().mockImplementationOnce(null);

        const id = 120;
        const updateUserDTO: UpdateUserDTO = {
            name: 'Usuário Teste EDT',
            email: 'test2@test.com',
        };

        // assert
        expect(useCase.execute(id, updateUserDTO)).rejects.toThrow(NotFoundException);
    });
});
