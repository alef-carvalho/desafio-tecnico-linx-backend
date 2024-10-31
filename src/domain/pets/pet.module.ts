import { Module } from '@nestjs/common';
import { PetFactory } from './pet.factory';
import { PetController } from './pet.controller';
import { CreatePetUseCase } from './usecases/create-pet.usecase';
import { DeletePetUseCase } from './usecases/delete-pet.usecase';
import { FindPetUseCase } from './usecases/find-pet.usecase';
import { ListPetUseCase } from './usecases/list-pet.usecase';
import { UpdatePetUseCase } from './usecases/update-pet.usecase';
import { IsPetIdConstraint } from './validators/is-pet-id.validator';

@Module({
    controllers: [PetController],
    providers: [PetFactory, CreatePetUseCase, DeletePetUseCase, FindPetUseCase, ListPetUseCase, UpdatePetUseCase, IsPetIdConstraint],
})
export class PetModule {}
