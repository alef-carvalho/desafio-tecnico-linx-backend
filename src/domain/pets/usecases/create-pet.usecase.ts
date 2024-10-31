import { AuthUser } from '@domain/auth/auth.interface';
import { PetFactory } from '../pet.factory';
import { CreatePetDTO } from '../dto/create-pet.dto';
import { PrismaService } from '@infra/database/services';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class CreatePetUseCase {
    constructor(
        private readonly petFactory: PetFactory,
        private readonly prismaService: PrismaService,
    ) {}

    async execute(createPetDTO: CreatePetDTO, user: AuthUser) {
        const exists = await this.prismaService.pet.findFirst({
            where: {
                name: createPetDTO.name,
                user_id: user.id,
            },
        });

        if (exists) {
            throw new ConflictException('Pet já registrado para este cliente');
        }

        const data = this.petFactory.forCreate(createPetDTO, user);
        return this.prismaService.pet.create({
            data,
        });
    }
}
