// package: main
// file: main.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as main_pb from "./main_pb";

interface IAppServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    findOne: IAppServiceService_IFindOne;
}

interface IAppServiceService_IFindOne extends grpc.MethodDefinition<main_pb.HeroById, main_pb.Hero> {
    path: "/main.AppService/FindOne";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<main_pb.HeroById>;
    requestDeserialize: grpc.deserialize<main_pb.HeroById>;
    responseSerialize: grpc.serialize<main_pb.Hero>;
    responseDeserialize: grpc.deserialize<main_pb.Hero>;
}

export const AppServiceService: IAppServiceService;

export interface IAppServiceServer extends grpc.UntypedServiceImplementation {
    findOne: grpc.handleUnaryCall<main_pb.HeroById, main_pb.Hero>;
}

export interface IAppServiceClient {
    findOne(request: main_pb.HeroById, callback: (error: grpc.ServiceError | null, response: main_pb.Hero) => void): grpc.ClientUnaryCall;
    findOne(request: main_pb.HeroById, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: main_pb.Hero) => void): grpc.ClientUnaryCall;
    findOne(request: main_pb.HeroById, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: main_pb.Hero) => void): grpc.ClientUnaryCall;
}

export class AppServiceClient extends grpc.Client implements IAppServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public findOne(request: main_pb.HeroById, callback: (error: grpc.ServiceError | null, response: main_pb.Hero) => void): grpc.ClientUnaryCall;
    public findOne(request: main_pb.HeroById, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: main_pb.Hero) => void): grpc.ClientUnaryCall;
    public findOne(request: main_pb.HeroById, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: main_pb.Hero) => void): grpc.ClientUnaryCall;
}
