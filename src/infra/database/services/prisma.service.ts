import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    //
    constructor() {
        super({
            //log: ['error', 'info', 'query', 'warn'],
        });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
