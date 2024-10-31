import { AuthUser } from '@domain/auth/auth.interface';
import { CacheService } from '@infra/cache/cache.service';
import { PrismaService } from '@infra/database/services';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FindPetUseCase {
    constructor(
        private readonly cacheService: CacheService,
        private readonly prismaService: PrismaService,
    ) {}

    async execute(id: number, user: AuthUser) {
        const cacheKey = this.cacheService.getKey(FindPetUseCase.name, { id, user });
        const cachedItem = await this.cacheService.get(cacheKey);

        if (cachedItem) {
            return cachedItem;
        }

        const pet = await this.prismaService.pet.findUnique({
            where: { id, user_id: user.id },
        });

        if (!pet || pet.user_id != user.id) {
            throw new NotFoundException('Pet não encontrado');
        }

        await this.cacheService.set(cacheKey, pet);
        return pet;
    }
}
