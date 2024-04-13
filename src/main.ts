import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigsModule } from './configs/config.module';
import NestjsLoggerServiceAdapter from './core/logger/modules/logger.adapter';
import { ExceptionsFilter } from './core/responses/filter/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {join} from 'path';

async function bootstrap() {
    // const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    //     bufferLogs: true,
    // });

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
          transport: Transport.GRPC,
          options: {
            package: 'authservice',
            protoPath: join(__dirname, './feature/auth/proto/auth.proto'),
            url: `0.0.0.0:3001`,
            loader: {
              enums: String,
              objects: true,
              arrays: true,
              longs: Number
            },
          },
        },
      );

    // Config the logger
    // const customLogger = app.get(NestjsLoggerServiceAdapter);
    // app.useLogger(customLogger);

    // // Config the filter for the exceptions
    // app.useGlobalFilters(new ExceptionsFilter());

    //Get the value from the environment variables
    // const configService = app.get(ConfigService<ConfigsModule>);
    // const port = configService.get<number>('port');

    // const config = new DocumentBuilder()
    //     .setTitle('Your API')
    //     .setDescription('API description')
    //     .setVersion('1.0')
    //     .build();
    // // const document = SwaggerModule.createDocument(app, config);
    // // SwaggerModule.setup('api', app, document);

    // Listen on the port
    // await app.listen(port, async () => {
    //     const url = await app.getUrl();
    //     customLogger.log(`Server running on ${url}`);
    // });
    await app.listen()
}

bootstrap();
