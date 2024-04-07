import { Module } from '@nestjs/common';
import { SignUpService } from './sign_up.service';
import { SignUpController } from './sign_up.controller';
import { signUpProviders } from './sign_up.providers';
import { TokenModule } from '../token/token.module';
import { UsersModule } from '../../user/users/users.module';
import { DatabaseModule } from 'src/core/database/modules/database.module';

@Module({
    imports: [TokenModule, UsersModule],
    controllers: [SignUpController],
    providers: [SignUpService, ...signUpProviders],
})
export class SignUpModule {}
