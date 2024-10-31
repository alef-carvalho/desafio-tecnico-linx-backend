import { UserRepository } from '@infra/database/repositories';
import { ConflictException } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from '@domain/users/dto/create-user.dto';
import { Role } from '@infra/database/enums';

describe('CreateUserUseCase', () => {
    //
    let useCase: CreateUserUseCase;

    const planRepositoryMock = {
        findOneBy: jest.fn().mockResolvedValue(null),
        save: jest.fn().mockResolvedValue({
            _id: '66bb9584f3e180e37d52b464',
            name: 'Usuário Teste',
            role: Role.ADMIN,
            email: 'admin@test.com',
            password: '12345678',
        }),
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [CreateUserUseCase, { provide: UserRepository, useValue: planRepositoryMock }],
        }).compile();
        useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    });

    it('should be create the user', async () => {
        // arrange
        const createUserDTO: CreateUserDTO = {
            name: 'Usuário Teste',
            role: Role.ADMIN,
            email: 'admin@test.com',
            password: '12345678',
        };

        // act
        const result = await useCase.execute(createUserDTO);

        // assert
        expect(result.name).toEqual(createUserDTO.name);
        expect(result.email).toEqual(createUserDTO.email);
        expect(planRepositoryMock.save).toHaveBeenCalledTimes(1);
        expect(planRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
    });

    it('should be thrown a conflict exception if user email is already registered', () => {
        // arrange
        planRepositoryMock.findOneBy = jest.fn().mockImplementationOnce(async () => ({ email: 'admin@test.com' }));
        const createUserDTO: CreateUserDTO = {
            name: 'Plano Teste',
            role: Role.ADMIN,
            email: 'admin@test.com',
            password: '12345678',
        };

        // assert
        expect(useCase.execute(createUserDTO)).rejects.toThrow(ConflictException);
    });
});
