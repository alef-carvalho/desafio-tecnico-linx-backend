import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';

@Controller('e2e')
class E2ETestingController {
    @Get()
    index() {
        return {
            ready: true,
        };
    }
}

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [E2ETestingController],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/e2e (GET)', () => {
        return request(app.getHttpServer()).get('/e2e').expect(200).expect({
            ready: true,
        });
    });
});
