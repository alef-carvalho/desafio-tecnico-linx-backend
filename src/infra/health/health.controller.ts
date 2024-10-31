import { IsPublic } from '@common/decorators';
import { HealthCheck } from '@nestjs/terminus';
import { HealthService } from './health.service';
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
    constructor(private readonly healthyService: HealthService) {}

    @Get()
    @IsPublic()
    @HealthCheck()
    check() {
        return this.healthyService.check();
    }
}
