import { classes } from '@automapper/classes';
import { Module } from '@nestjs/common';
import { AutomapperModule } from '@automapper/nestjs';
import { DatabaseModule } from '@infra/database/database.module';
import { ConfigModule } from '@infra/config/config.module';
import { CacheModule } from '@infra/cache/cache.module';
import { HealthModule } from '@infra/health/health.module';

@Module({
    imports: [ConfigModule, CacheModule, AutomapperModule.forRoot({ strategyInitializer: classes() }), DatabaseModule, HealthModule],
})
export class InfraModule {}
