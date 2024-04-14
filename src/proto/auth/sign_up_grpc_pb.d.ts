// package: sign_up
// file: auth/sign_up.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as auth_sign_up_pb from "../auth/sign_up_pb";

interface ISignUpServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    signUp: ISignUpServiceService_ISignUp;
}

interface ISignUpServiceService_ISignUp extends grpc.MethodDefinition<auth_sign_up_pb.SignUpRequest, auth_sign_up_pb.SignUpResponse> {
    path: "/sign_up.SignUpService/SignUp";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<auth_sign_up_pb.SignUpRequest>;
    requestDeserialize: grpc.deserialize<auth_sign_up_pb.SignUpRequest>;
    responseSerialize: grpc.serialize<auth_sign_up_pb.SignUpResponse>;
    responseDeserialize: grpc.deserialize<auth_sign_up_pb.SignUpResponse>;
}

export const SignUpServiceService: ISignUpServiceService;

export interface ISignUpServiceServer extends grpc.UntypedServiceImplementation {
    signUp: grpc.handleUnaryCall<auth_sign_up_pb.SignUpRequest, auth_sign_up_pb.SignUpResponse>;
}

export interface ISignUpServiceClient {
    signUp(request: auth_sign_up_pb.SignUpRequest, callback: (error: grpc.ServiceError | null, response: auth_sign_up_pb.SignUpResponse) => void): grpc.ClientUnaryCall;
    signUp(request: auth_sign_up_pb.SignUpRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_sign_up_pb.SignUpResponse) => void): grpc.ClientUnaryCall;
    signUp(request: auth_sign_up_pb.SignUpRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_sign_up_pb.SignUpResponse) => void): grpc.ClientUnaryCall;
}

export class SignUpServiceClient extends grpc.Client implements ISignUpServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public signUp(request: auth_sign_up_pb.SignUpRequest, callback: (error: grpc.ServiceError | null, response: auth_sign_up_pb.SignUpResponse) => void): grpc.ClientUnaryCall;
    public signUp(request: auth_sign_up_pb.SignUpRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_sign_up_pb.SignUpResponse) => void): grpc.ClientUnaryCall;
    public signUp(request: auth_sign_up_pb.SignUpRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_sign_up_pb.SignUpResponse) => void): grpc.ClientUnaryCall;
}
