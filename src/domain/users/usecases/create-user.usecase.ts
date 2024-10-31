import { CreateUserDTO } from '../dto/create-user.dto';
import { PrismaService } from '@infra/database/services';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class CreateUserUseCase {
    constructor(private readonly prismaService: PrismaService) {}

    async execute(createUserDTO: CreateUserDTO) {
        const exists = await this.prismaService.user.findFirst({
            where: { email: createUserDTO.email },
            select: { id: true },
        });

        if (exists) {
            throw new ConflictException('Usuário já registrado');
        }

        return this.prismaService.user.create({
            data: createUserDTO,
        });
    }
}
