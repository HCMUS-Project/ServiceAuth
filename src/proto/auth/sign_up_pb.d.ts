// package: sign_up
// file: auth/sign_up.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class SignUpRequest extends jspb.Message { 
    getEmail(): string;
    setEmail(value: string): SignUpRequest;
    getPassword(): string;
    setPassword(value: string): SignUpRequest;
    getDomain(): string;
    setDomain(value: string): SignUpRequest;
    getDevice(): string;
    setDevice(value: string): SignUpRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SignUpRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SignUpRequest): SignUpRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SignUpRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SignUpRequest;
    static deserializeBinaryFromReader(message: SignUpRequest, reader: jspb.BinaryReader): SignUpRequest;
}

export namespace SignUpRequest {
    export type AsObject = {
        email: string,
        password: string,
        domain: string,
        device: string,
    }
}

export class SignUpResponse extends jspb.Message { 
    getResult(): string;
    setResult(value: string): SignUpResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SignUpResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SignUpResponse): SignUpResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SignUpResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SignUpResponse;
    static deserializeBinaryFromReader(message: SignUpResponse, reader: jspb.BinaryReader): SignUpResponse;
}

export namespace SignUpResponse {
    export type AsObject = {
        result: string,
    }
}
