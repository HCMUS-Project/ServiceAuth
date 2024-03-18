import { Module } from '@nestjs/common';
import { SignUpService } from './sign_up.service';
import { SignUpController } from './sign_up.controller';
import { DatabaseModule } from 'src/core/database/modules/database.module';
import { signUpProviders } from './sign_up.providers';
import { LoggerModule } from 'src/core/logger/modules/logger.module';

@Module({
    imports: [DatabaseModule, LoggerModule],
    controllers: [SignUpController],
    providers: [SignUpService, ...signUpProviders],
})
export class SignUpModule {}
