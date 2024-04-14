import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SignUpService } from './sign_up.service';
import { SignUpRequest, SignUpResponse } from 'src/proto_build/auth/sign_up_pb';

@Controller()
export class SignUpController {
    constructor(private readonly signUpService: SignUpService) {}

    @GrpcMethod('SignUpService', 'SignUp')
    async signUp(data: SignUpRequest): Promise<SignUpResponse> {
        let result = await this.signUpService.signUp(data);
        return result;
    }
}
