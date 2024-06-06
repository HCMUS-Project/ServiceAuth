import {
    GetProfileRequest,
    GetProfileResponse,
    GetTenantProfileRequest,
    GetTenantProfileResponse,
    UpdateProfileRequest,
    UpdateProfileResponse,
    UpdateTenantProfileRequest,
    UpdateTenantProfileResponse,
} from 'src/proto_build/auth/profile_pb';

export interface IGetProfileRequest extends GetProfileRequest.AsObject {}
export interface IGetProfileResponse extends GetProfileResponse.AsObject {}

export interface IGetTenantProfileRequest extends GetTenantProfileRequest.AsObject {}
export interface IGetTenantProfileResponse extends GetTenantProfileResponse.AsObject {}

export interface IUpdateProfileRequest extends UpdateProfileRequest.AsObject {}
export interface IUpdateProfileResponse extends UpdateProfileResponse.AsObject {}

export interface IUpdateTenantProfileRequest extends UpdateTenantProfileRequest.AsObject {}
export interface IUpdateTenantProfileResponse extends UpdateTenantProfileResponse.AsObject {}