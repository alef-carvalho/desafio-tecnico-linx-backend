import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@infra/database/services/prisma.service';

@Global()
@Module({
    exports: [PrismaService],
    providers: [PrismaService],
})
export class DatabaseModule {}
