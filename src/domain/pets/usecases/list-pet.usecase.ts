import { AuthUser } from '@domain/auth/auth.interface';
import { Injectable } from '@nestjs/common';
import { CacheService } from '@infra/cache/cache.service';
import { PrismaService } from '@infra/database/services';
import { Prisma } from '@prisma/client';

@Injectable()
export class ListPetUseCase {
    constructor(
        private readonly cacheService: CacheService,
        private readonly prismaService: PrismaService,
    ) {}

    async execute(page: number, size: number, user: AuthUser) {
        const cacheKey = this.cacheService.getKey(ListPetUseCase.name, { page, size, user });
        const cacheResult = await this.cacheService.get(cacheKey);

        if (cacheResult) {
            return cacheResult;
        }

        const where: Prisma.PetWhereInput = {
            user_id: user.id,
        };

        const [total, records] = await Promise.all([
            this.prismaService.pet.count({
                where,
            }),
            this.prismaService.pet.findMany({
                take: size,
                skip: (page - 1) * size,
                where,
                select: {
                    id: true,
                    name: true,
                    type: true,
                },
                orderBy: {
                    name: 'asc',
                },
            }),
        ]);

        const results = {
            data: records,
            meta: {
                page,
                size,
                total,
                totalPages: Math.ceil(total / size),
            },
        };

        await this.cacheService.set(cacheKey, results);
        return results;
    }
}
