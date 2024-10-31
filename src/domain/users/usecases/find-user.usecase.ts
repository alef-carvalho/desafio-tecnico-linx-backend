import { CacheService } from '@infra/cache/cache.service';
import { PrismaService } from '@infra/database/services';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FindUserUseCase {
    constructor(
        private readonly cacheService: CacheService,
        private readonly prismaService: PrismaService,
    ) {}

    async execute(id: number) {
        const cacheKey = this.cacheService.getKey(FindUserUseCase.name, { id });
        const cachedResult = await this.cacheService.get(cacheKey);

        if (cachedResult) {
            return cachedResult;
        }

        const user = await this.prismaService.user.findFirst({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        await this.cacheService.set(cacheKey, user);
        return user;
    }
}
