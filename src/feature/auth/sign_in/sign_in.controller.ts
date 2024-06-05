import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SignInService } from './sign_in.service';
import { IChangePasswordRequest, IChangePasswordResponse, ISignInRequest, ISignInResponse } from './interface/sign_in.interface';

@Controller()
export class SignInController {
    constructor(private readonly signInService: SignInService) {}

    @GrpcMethod('SignInService', 'SignIn')
    async signIn(data: ISignInRequest): Promise<ISignInResponse> {
        return await this.signInService.signIn(data);
    }

    @GrpcMethod('SignInService', 'ChangePassword')
    async changePassword(data: IChangePasswordRequest): Promise<IChangePasswordResponse> {
        return await this.signInService.changePassword(data);
    }
}
