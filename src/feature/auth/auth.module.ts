import { Module } from '@nestjs/common';
import { SignUpModule } from './sign_up/sign_up.module';

@Module({
    imports: [SignUpModule],
})
export class AuthModule {}
