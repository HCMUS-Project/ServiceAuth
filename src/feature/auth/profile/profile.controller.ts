import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProfileService } from './profile.service';
import {
    IGetProfileRequest,
    IGetProfileResponse,
    IGetTenantProfileResponse,
    IUpdateProfileRequest,
    IUpdateProfileResponse,
    IUpdateTenantProfileRequest,
    IUpdateTenantProfileResponse,
} from './interface/profile.interface';

@Controller()
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @GrpcMethod('ProfileService', 'GetProfile')
    async getProfile(data: IGetProfileRequest): Promise<IGetProfileResponse> {
        return await this.profileService.getProfile(data.user.email, data.user.domain);
    }

    @GrpcMethod('ProfileService', 'GetTenantProfile')
    async getTenantProfile(data: IGetProfileRequest): Promise<IGetTenantProfileResponse> {
        return await this.profileService.getTenantProfile(data.user.email);
    }

    @GrpcMethod('ProfileService', 'UpdateProfile')
    async updateProfile(data: IUpdateProfileRequest): Promise<IUpdateProfileResponse> {
        const { user, ...dataUpdate } = data;
        return await this.profileService.updateProfile(user.email, user.domain, dataUpdate);
    }

    @GrpcMethod('ProfileService', 'UpdateTenantProfile')
    async updateTenant(data: IUpdateTenantProfileRequest): Promise<IUpdateTenantProfileResponse> {
        // console.log(data)
        return await this.profileService.updateTenantProfile(data);
    }
}
