import { ObjectId } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';
import {
    ChangePasswordRequest,
    ChangePasswordResponse,
    SignInRequest,
    SignInResponse,
} from 'src/proto_build/auth/sign_in_pb';

export interface IAccountForGenerateToken {
    email: string;
    domain: string;
    role: Role;
}

export interface ISignInRequest extends SignInRequest.AsObject {}
export interface ISignInResponse extends SignInResponse.AsObject {}
export interface IChangePasswordRequest extends ChangePasswordRequest.AsObject {}
export interface IChangePasswordResponse extends ChangePasswordResponse.AsObject {}
