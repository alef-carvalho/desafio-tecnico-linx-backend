import { NestFactory } from '@nestjs/core';
import { AppModule } from '@application/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { SWAGGER_TAG_AUTH, SWAGGER_TAG_PETS, SWAGGER_TAG_PLANS, SWAGGER_TAG_USERS } from '@common/constants';
import { useContainer } from 'class-validator';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors();
    app.enableShutdownHooks();
    app.enableVersioning({ type: VersioningType.URI });
    app.setGlobalPrefix('api', {
        exclude: [{ path: 'health', method: RequestMethod.GET }],
    });
    app.enableShutdownHooks();
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    );

    // enable DI for class-validator
    useContainer(app.select(AppModule), {
        fallbackOnErrors: true,
    });

    const document = new DocumentBuilder()
        .setTitle('Linx - Desafio Técnico')
        .setDescription('API para gerenciamento de Pets')
        .setVersion('1.0.0')
        .addTag(SWAGGER_TAG_AUTH)
        .addTag(SWAGGER_TAG_PLANS)
        .addTag(SWAGGER_TAG_PETS)
        .addTag(SWAGGER_TAG_USERS)
        .addServer('http://localhost:3000', 'Local')
        .addBearerAuth(
            {
                in: 'Header',
                name: 'Authorization',
                scheme: 'Bearer',
                type: 'http',
                description: `Please enter token in following format: Bearer <JWT>`,
                bearerFormat: 'Bearer',
            },
            'access-token',
        )
        .build();

    SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, document), {
        customCss: new SwaggerTheme().getBuffer(SwaggerThemeNameEnum.DARK),
    });

    await app.listen(3000);
}

bootstrap();
