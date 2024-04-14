// package: sign_in
// file: auth/sign_in.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as auth_sign_in_pb from "../auth/sign_in_pb";

interface ISignInService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    signIn: ISignInService_ISignIn;
}

interface ISignInService_ISignIn extends grpc.MethodDefinition<auth_sign_in_pb.SignInRequest, auth_sign_in_pb.SignInResponse> {
    path: "/sign_in.SignIn/SignIn";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<auth_sign_in_pb.SignInRequest>;
    requestDeserialize: grpc.deserialize<auth_sign_in_pb.SignInRequest>;
    responseSerialize: grpc.serialize<auth_sign_in_pb.SignInResponse>;
    responseDeserialize: grpc.deserialize<auth_sign_in_pb.SignInResponse>;
}

export const SignInService: ISignInService;

export interface ISignInServer extends grpc.UntypedServiceImplementation {
    signIn: grpc.handleUnaryCall<auth_sign_in_pb.SignInRequest, auth_sign_in_pb.SignInResponse>;
}

export interface ISignInClient {
    signIn(request: auth_sign_in_pb.SignInRequest, callback: (error: grpc.ServiceError | null, response: auth_sign_in_pb.SignInResponse) => void): grpc.ClientUnaryCall;
    signIn(request: auth_sign_in_pb.SignInRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_sign_in_pb.SignInResponse) => void): grpc.ClientUnaryCall;
    signIn(request: auth_sign_in_pb.SignInRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_sign_in_pb.SignInResponse) => void): grpc.ClientUnaryCall;
}

export class SignInClient extends grpc.Client implements ISignInClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public signIn(request: auth_sign_in_pb.SignInRequest, callback: (error: grpc.ServiceError | null, response: auth_sign_in_pb.SignInResponse) => void): grpc.ClientUnaryCall;
    public signIn(request: auth_sign_in_pb.SignInRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_sign_in_pb.SignInResponse) => void): grpc.ClientUnaryCall;
    public signIn(request: auth_sign_in_pb.SignInRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_sign_in_pb.SignInResponse) => void): grpc.ClientUnaryCall;
}
