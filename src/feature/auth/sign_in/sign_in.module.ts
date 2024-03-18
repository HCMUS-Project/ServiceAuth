import { Module } from '@nestjs/common';
import { SignInService } from './sign_in.service';
import { SignInController } from './sign_in.controller';
import { DatabaseModule } from 'src/core/database/modules/database.module';
import { UserSchema } from '../../../models/user/schemas/user.schema';
// @ts-ignore
import { MongooseModule } from '@nestjs/mongoose';
import { signInProviders } from './sign_in.provider';
import {JwtModule} from "@nestjs/jwt";
import { LoggerModule } from 'src/core/logger/modules/logger.module';

@Module({
    imports: [DatabaseModule, JwtModule.register({}), LoggerModule],
    controllers: [SignInController],
    providers: [SignInService, ...signInProviders],
})
export class SignInModule {}
