import { Roles } from '@common/decorators';
import { AuthRequest } from '@domain/auth/auth.interface';
import { CreatePetDTO } from './dto/create-pet.dto';
import { UpdatePetDTO } from './dto/update-pet.dto';
import { ListPetQuery } from './query/list-pet.query';
import { FindPetQuery } from './query/find-pet.query';
import { UpdatePetQuery } from './query/update-pet.query';
import { DeletePetQuery } from './query/delete-pet.query';
import { CreatePetUseCase } from './usecases/create-pet.usecase';
import { DeletePetUseCase } from './usecases/delete-pet.usecase';
import { FindPetUseCase } from './usecases/find-pet.usecase';
import { ListPetUseCase } from './usecases/list-pet.usecase';
import { UpdatePetUseCase } from './usecases/update-pet.usecase';
import { API_V1, SWAGGER_TAG_PETS } from '@common/constants';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Request } from '@nestjs/common';

@ApiTags(SWAGGER_TAG_PETS)
@ApiBearerAuth('access-token')
@Controller({ path: 'pets', version: API_V1 })
export class PetController {
    constructor(
        private readonly findPetUseCase: FindPetUseCase,
        private readonly listPetUseCase: ListPetUseCase,
        private readonly createPetUseCase: CreatePetUseCase,
        private readonly updatePetUseCase: UpdatePetUseCase,
        private readonly deletePetUseCase: DeletePetUseCase,
    ) {}

    @Get()
    @Roles('CLIENT')
    @ApiOperation({ summary: 'Returns a paginated list of user pets' })
    findAll(@Query() { page, size }: ListPetQuery, @Request() { user }: AuthRequest) {
        return this.listPetUseCase.execute(page, size, user);
    }

    @Get(':petId')
    @Roles('CLIENT')
    @ApiParam({ name: 'petId', description: 'The id of pet', type: String })
    @ApiOperation({ summary: 'Returns the pet details' })
    findOne(@Param() { petId }: FindPetQuery, @Request() { user }: AuthRequest) {
        return this.findPetUseCase.execute(petId, user);
    }

    @Post()
    @Roles('CLIENT')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new pet' })
    create(@Body() createPetDTO: CreatePetDTO, @Request() { user }: AuthRequest) {
        return this.createPetUseCase.execute(createPetDTO, user);
    }

    @Put(':petId')
    @Roles('CLIENT')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBody({ type: UpdatePetDTO })
    @ApiParam({ name: 'petId', description: 'The id of pet', type: String })
    update(@Param() { petId }: UpdatePetQuery, @Body() updatePetDTO: UpdatePetDTO, @Request() { user }: AuthRequest) {
        return this.updatePetUseCase.execute(petId, updatePetDTO, user);
    }

    @Delete(':petId')
    @Roles('CLIENT')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiParam({ name: 'petId', description: 'The id of pet', type: String })
    @ApiOperation({ summary: 'Delete the pet' })
    delete(@Param() { petId }: DeletePetQuery, @Request() { user }: AuthRequest) {
        return this.deletePetUseCase.execute(petId, user);
    }
}
