import { Module } from '@nestjs/common';
import { SignUpModule } from './sign_up/sign_up.module';
import { VerifyAccountModule } from './verify_account/verify_account.module';
import { SignInModule } from './sign_in/sign_in.module';

@Module({
    imports: [SignUpModule, VerifyAccountModule, SignInModule],
})
export class AuthModule {}
