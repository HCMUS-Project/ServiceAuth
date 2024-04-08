import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigsModule } from './configs/config.module';
import NestjsLoggerServiceAdapter from './core/logger/modules/logger.adapter';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
    const configService = new ConfigService();
    const port = configService.get<number>('port');

    // Create the app
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            package: '',
            protoPath: join(__dirname, '../../proto/rpc.proto'),
            url: `0.0.0.0:${port}`,
            loader: {
                enums: String,
                objects: true,
                arrays: true,
            },
        },
    });

    // Config the logger
    const customLogger = app.get(NestjsLoggerServiceAdapter);
    app.useLogger(customLogger);

    // Listen on the port
    await app
        .listen()
        .then(() => {
            customLogger.log('Microservice is listening on port ' + port);
        })
        .catch(err => {
            customLogger.error(err);
        });
}

bootstrap();
