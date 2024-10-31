import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/services';

@Injectable()
export class DeleteUserUseCase {
    constructor(private readonly prismaService: PrismaService) {}

    async execute(id: number) {
        return this.prismaService.user.delete({
            where: { id },
        });
    }
}
