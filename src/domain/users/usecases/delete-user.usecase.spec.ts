import { PrismaService } from '@infra/database/services';
import { DeleteUserUseCase } from './delete-user.usecase';
import { Test, TestingModule } from '@nestjs/testing';

describe('DeleteUserUseCase', () => {
    //
    let useCase: DeleteUserUseCase;

    const prismaServiceMock = {
        user: {
            delete: jest.fn().mockResolvedValue(true),
        },
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [DeleteUserUseCase, { provide: PrismaService, useValue: prismaServiceMock }],
        }).compile();
        useCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
    });

    it('should be delete the user', async () => {
        // arrange
        const id = 120;

        // act
        await useCase.execute(id);

        // assert
        expect(prismaServiceMock.user.delete).toHaveBeenCalledTimes(1);
        expect(prismaServiceMock.user.delete).toHaveBeenCalledWith({
            where: { id },
        });
    });
});
