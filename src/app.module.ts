/**
 * Main module of the application
 * Sets the configuration module as a global module
 */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigsModule } from './configs/config.module';
import { LoggerModule } from './core/logger/modules/logger.module';
import { ContextModule } from './configs/context/modules/contextStorage.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './core/responses/interceptors/response.interceptor';
import { DatabaseModule } from './core/database/modules/database.module';
import { SignUpModule } from './feature/auth/sign_up/sign_up.module';
import { SignInModule } from './feature/auth/sign_in/sign_in.module';
import {TokenModule} from './feature/auth/token/token.module';
import {UsersModule} from './feature/auth/users/users.module';

@Module({
    imports: [
        LoggerModule,
        ConfigsModule,
        ContextModule,
        DatabaseModule,
        SignUpModule,
        SignInModule,
        TokenModule,
        UsersModule
    ],
    controllers: [AppController],
    providers: [AppService, { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor }],
})
export class AppModule {}
