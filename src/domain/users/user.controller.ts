import { Roles } from '@common/decorators';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ListUserQuery } from './query/list-user.query';
import { FindUserQuery } from './query/find-user.query';
import { UpdateUserQuery } from './query/update-user.query';
import { DeleteUserQuery } from './query/delete-user.query';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { DeleteUserUseCase } from './usecases/delete-user.usecase';
import { FindUserUseCase } from './usecases/find-user.usecase';
import { ListUserUserUseCase } from './usecases/list-user.usecase';
import { UpdateUserUseCase } from './usecases/update-user.usecase';
import { API_V1, SWAGGER_TAG_USERS } from '@common/constants';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';

@ApiTags(SWAGGER_TAG_USERS)
@ApiBearerAuth('access-token')
@Controller({ path: 'users', version: API_V1 })
export class UserController {
    constructor(
        private readonly findUserUseCase: FindUserUseCase,
        private readonly listUserUseCase: ListUserUserUseCase,
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
    ) {}

    @Get()
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Returns a paginated list of users' })
    findAll(@Query() { page, size }: ListUserQuery) {
        return this.listUserUseCase.execute(page, size);
    }

    @Get(':userId')
    @Roles('ADMIN')
    @ApiParam({ name: 'userId', description: 'The id of user', type: String })
    @ApiOperation({ summary: 'Returns the user details' })
    findOne(@Param() { userId }: FindUserQuery) {
        return this.findUserUseCase.execute(userId);
    }

    @Post()
    @Roles('ADMIN')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new user' })
    create(@Body() createUserDTO: CreateUserDTO) {
        return this.createUserUseCase.execute(createUserDTO);
    }

    @Put(':userId')
    @Roles('ADMIN')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBody({ type: UpdateUserDTO })
    @ApiParam({ name: 'userId', description: 'The id of user', type: String })
    update(@Param() { userId }: UpdateUserQuery, @Body() updateUserDTO: UpdateUserDTO) {
        return this.updateUserUseCase.execute(userId, updateUserDTO);
    }

    @Delete(':userId')
    @Roles('ADMIN')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiParam({ name: 'userId', description: 'The id of user', type: String })
    @ApiOperation({ summary: 'Delete the user' })
    delete(@Param() { userId }: DeleteUserQuery) {
        return this.deleteUserUseCase.execute(userId);
    }
}
