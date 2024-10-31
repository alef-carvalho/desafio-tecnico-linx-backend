import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { DeleteUserUseCase } from './usecases/delete-user.usecase';
import { FindUserUseCase } from './usecases/find-user.usecase';
import { ListUserUserUseCase } from './usecases/list-user.usecase';
import { UpdateUserUseCase } from './usecases/update-user.usecase';
import { IsUserIdConstraint } from './validators/is-user-id.validator';

@Module({
    controllers: [UserController],
    providers: [CreateUserUseCase, DeleteUserUseCase, FindUserUseCase, ListUserUserUseCase, UpdateUserUseCase, IsUserIdConstraint],
})
export class UserModule {}
