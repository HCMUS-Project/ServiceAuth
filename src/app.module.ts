/**
 * Main module of the application
 * Sets the configuration module as a global module
 */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigsModule } from './configs/config.module';
import { ContextModule } from './configs/context/modules/contextStorage.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './core/responses/interceptors/response.interceptor';
import { DatabaseModule } from './core/database/modules/database.module';
import { SignUpModule } from './feature/auth/sign_up/sign_up.module';
import { SignInModule } from './feature/auth/sign_in/sign_in.module';
import { TokenModule } from './feature/auth/token/token.module';
import { UsersModule } from './feature/user/users/users.module';
import { CacheModule } from './core/cache/modules/cache.module';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {OtpModule} from "./feature/auth/otp/otp.module";

@Module({
    imports: [
        CacheModule,
        ConfigsModule,
        ContextModule,
        DatabaseModule,
        SignUpModule,
        SignInModule,
        TokenModule,
        UsersModule,
        OtpModule,
        // CacheModule.registerAsync(RedisOptions)
    ],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: CacheInterceptor,
        // },
    ],
})
export class AppModule {}
