import { Module } from '@nestjs/common';
import { SignUpService } from './sign_up.service';
import { SignUpController } from './sign_up.controller';
import { DatabaseModule } from 'src/core/database/modules/database.module';
import { signUpProviders } from './sign_up.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [SignUpController],
    providers: [SignUpService, ...signUpProviders],
})
export class SignUpModule {}
