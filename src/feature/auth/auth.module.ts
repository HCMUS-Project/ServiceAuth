/**
 *
 */

import { Module } from '@nestjs/common';
import { SignInModule } from './sign_in/sign_in.module';
import { SignUpModule } from './sign_up/sign_up.module';
import { RouteConfig } from '@nestjs/platform-fastify';
import { RouterModule } from '@nestjs/core';

@Module({
    imports: [
        SignInModule,
        SignUpModule,
        RouterModule.register([{ path: 'api/auth', children: [SignInModule, SignUpModule] }]),
    ],
    controllers: [],
    providers: [],
})
export class AuthModule {}
