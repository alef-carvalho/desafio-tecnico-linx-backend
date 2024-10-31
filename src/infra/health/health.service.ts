import { Injectable } from '@nestjs/common';
import { DiskHealthIndicator, HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { HEALTHY_INTERNET_PING_CHECK_URL, HEALTHY_MEMORY_CHECK_HEAP_LIMIT, HEALTHY_STORAGE_CHECK_PATH } from './health.constants';

@Injectable()
export class HealthService {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private readonly disk: DiskHealthIndicator,
        private memory: MemoryHealthIndicator,
    ) {}

    check() {
        return this.health.check([() => this.checkInternet(), () => this.checkMemory(), () => this.checkStorage()]);
    }

    private checkInternet() {
        return this.http.pingCheck('internet', HEALTHY_INTERNET_PING_CHECK_URL);
    }

    private checkMemory() {
        return this.memory.checkHeap('memory', HEALTHY_MEMORY_CHECK_HEAP_LIMIT);
    }

    private checkStorage() {
        return this.disk.checkStorage('storage', {
            path: HEALTHY_STORAGE_CHECK_PATH,
            thresholdPercent: 0.5,
        });
    }
}
