import { AuthUser } from '@domain/auth/auth.interface';
import { PrismaService } from '@infra/database/services';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeletePetUseCase {
    constructor(private readonly prismaService: PrismaService) {}

    async execute(id: number, user: AuthUser) {
        const pet = await this.prismaService.pet.findUnique({
            where: { id, user_id: user.id },
        });

        if (!pet) {
            throw new NotFoundException('Pet não encontrado');
        }

        return this.prismaService.pet.delete({
            where: { id },
        });
    }
}
