import { AuthUser } from '@domain/auth/auth.interface';
import { PetFactory } from '../pet.factory';
import { UpdatePetDTO } from '../dto/update-pet.dto';
import { PrismaService } from '@infra/database/services';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UpdatePetUseCase {
    constructor(
        private readonly factory: PetFactory,
        private readonly prismaService: PrismaService,
    ) {}

    async execute(id: number, updatePetDTO: UpdatePetDTO, user: AuthUser) {
        const pet = await this.prismaService.pet.findUnique({
            where: { id, user_id: user.id },
        });

        if (!pet || pet.user_id != user.id) {
            throw new NotFoundException('Pet não encontrado');
        }

        const data = this.factory.forUpdate(updatePetDTO);
        return this.prismaService.pet.update({
            data,
            where: { id },
        });
    }
}
