import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SignInService } from './sign_in.service';
import { SignInRequest, SignInResponse } from 'src/proto_build/auth/sign_in_pb';

@Controller()
export class SignInController {
    constructor(private readonly signInService: SignInService) {}

    @GrpcMethod('SignInService', 'SignIn')
    async signIn(data: SignInRequest): Promise<SignInResponse> {
        return await this.signInService.signIn(data);
    }
}
