import {
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    SendMailRequest,
    SendMailResponse,
    VerifyAccountRequest,
    VerifyAccountResponse,
} from 'src/proto_build/auth/verify_account_pb';

export interface IVerifyAccountRequest extends VerifyAccountRequest.AsObject {}
export interface IVerifyAccountResponse extends VerifyAccountResponse.AsObject {}

export interface ISendMailRequest extends SendMailRequest.AsObject {}
export interface ISendMailResponse extends SendMailResponse.AsObject {}

export interface IForgotPasswordRequest extends ForgotPasswordRequest.AsObject {}
export interface IForgotPasswordResponse extends ForgotPasswordResponse.AsObject {}