import { Injectable } from '@nestjs/common';
import { CacheService } from '@infra/cache/cache.service';
import { PrismaService } from '@infra/database/services';

@Injectable()
export class ListUserUserUseCase {
    constructor(
        private readonly cacheService: CacheService,
        private readonly prismaService: PrismaService,
    ) {}

    async execute(page: number, size: number) {
        const cacheKey = this.cacheService.getKey(ListUserUserUseCase.name, { page, size });
        const cachedItems = await this.cacheService.get(cacheKey);

        if (cachedItems) {
            return cachedItems;
        }

        const [total, records] = await Promise.all([
            this.prismaService.user.count(),
            this.prismaService.user.findMany({
                take: size,
                skip: (page - 1) * size,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
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
