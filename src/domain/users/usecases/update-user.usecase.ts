import { UpdateUserDTO } from '../dto/update-user.dto';
import { PrismaService } from '@infra/database/services';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UpdateUserUseCase {
    constructor(private readonly prismaService: PrismaService) {}

    async execute(id: number, updateUserDTO: UpdateUserDTO) {
        const user = await this.prismaService.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        return this.prismaService.user.update({
            data: updateUserDTO,
            where: { id },
        });
    }
}
