import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
    SendMailRequest,
    SendMailResponse,
    VerifyAccountRequest,
    VerifyAccountResponse,
} from 'src/proto_build/auth/verify_account_pb';
import { VerifyAccountService } from './verify_account.service';

@Controller()
export class VerifyAccountController {
    constructor(private readonly verifyAccountService: VerifyAccountService) {}

    @GrpcMethod('VerifyAccountService', 'VerifyAccount')
    async verifyAccount(data: VerifyAccountRequest): Promise<VerifyAccountResponse> {
        return await this.verifyAccountService.verifyAccount(data);
    }

    @GrpcMethod('VerifyAccountService', 'SendMailOtp')
    async sendMailOtp(data: SendMailRequest): Promise<SendMailResponse> {
        return await this.verifyAccountService.sendMailOtp(data);
    }
}
