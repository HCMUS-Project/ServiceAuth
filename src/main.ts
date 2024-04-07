import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigsModule } from './configs/config.module';
import NestjsLoggerServiceAdapter from './core/logger/modules/logger.adapter';
import { ExceptionsFilter } from './core/responses/filter/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { fastifyHelmet } from '@fastify/helmet';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        bufferLogs: true,
    });

    // Config validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            // transform: true,
            // whitelist: true,
            // forbidNonWhitelisted: true,
            // validationError: { target: false },
            // skipMissingProperties: false,
        }),
    );

    // Config the filter for the exceptions
    app.useGlobalFilters(new ExceptionsFilter());

    // Register helmet
    await app.register(fastifyHelmet, {
        contentSecurityPolicy: false,
    });

    //Get the value from the environment variables
    const configService = app.get(ConfigService<ConfigsModule>);
    const port = configService.get<number>('port');

    // Config the logger
    const customLogger = app.get(NestjsLoggerServiceAdapter);
    app.useLogger(customLogger);

    // Config the Swagger
    const config = new DocumentBuilder()
        .setTitle('Auth API')
        .setDescription('API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Listen on the port
    await app.listen(port, async () => {
        const url = await app.getUrl();
        customLogger.log(`Server running on ${url}`);
    });
}

bootstrap();
