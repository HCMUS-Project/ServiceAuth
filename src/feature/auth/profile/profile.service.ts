import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/models/user/interface/user.interface';
import { Profile } from 'src/models/user/interface/profile.interface';
import { IGetProfileResponse, IGetTenantProfileResponse, IUpdateProfileResponse, IUpdateTenantProfileRequest, IUpdateTenantProfileResponse } from './interface/profile.interface';
import { GrpcInternalException, GrpcUnauthenticatedException } from 'nestjs-grpc-exceptions';
import { TenantProfile } from 'src/models/tenant/interface/profile.interface';
import { Tenant } from 'src/models/tenant/interface/user.interface';

@Injectable()
export class ProfileService {
    constructor(
        @Inject('USER_MODEL') private readonly User: Model<User>,
        @Inject('PROFILE_MODEL') private readonly Profile: Model<Profile>,
        @Inject('TENANT_MODEL') private readonly Tenant: Model<Tenant>,
        @Inject('TENANTPROFILE_MODEL') private readonly TenantProfile: Model<TenantProfile>,
    ) {}

    async getProfile(email: string, domain: string): Promise<IGetProfileResponse> {
        try {
            if (domain == undefined) throw new GrpcUnauthenticatedException('DOMAIN_IS_UNDEFINED');
            // check if user exists
            const user = await this.User.findOne({ email, domain, is_deleted: false }).populate(
                'profile_id',
            );

            if (!user) throw new GrpcUnauthenticatedException('USER_NOT_FOUND');
            if (!user.is_active) throw new GrpcUnauthenticatedException('USER_NOT_ACTIVE');

            const { role, profile_id } = user;
            if (typeof profile_id !== 'string') {
                const { age, phone, address, gender, name, username } = profile_id;
                return {
                    email,
                    domain,
                    role: role,
                    age,
                    phone,
                    address,
                    gender,
                    name,
                    username
                };
            }
            throw new GrpcInternalException('INTERNAL_ERROR');
        } catch (error) {
            throw error;
        }
    }

    async getTenantProfile(email: string): Promise<IGetTenantProfileResponse> {
        try {
            // console.log(email, domain);
            // check if user exists
            const tenantprofile = await this.TenantProfile.findOne({ email,is_verify: true });

            if (!tenantprofile) throw new GrpcUnauthenticatedException('TENANT_PROFILE_NOT_FOUND');
            if (!tenantprofile.is_verify) throw new GrpcUnauthenticatedException('TENANT_NOT_VERIFIED');

            return {
                tenantprofile: {
                    ...tenantprofile,
                    username: tenantprofile.username,
                    email: tenantprofile.email,
                    phone: tenantprofile.phone,
                    gender: tenantprofile.gender,
                    address: tenantprofile.address,
                    age: tenantprofile.age,
                    avatar: tenantprofile.avatar,
                    name: tenantprofile.name,
                    stage: tenantprofile.stage,
                    companyName: tenantprofile.companyName,
                    companyAddress: tenantprofile.companyAddress,
                    domain: tenantprofile.domain,
                    isVerify: String(tenantprofile.is_verify),
                    createdAt: String(tenantprofile.createdAt),
                },
            };

        }
        catch (error) {
            throw error;
        }
    }



    async updateProfile(
        email: string,
        domain: string,
        data: object,
    ): Promise<IUpdateProfileResponse> {
        try {
            if (domain == undefined) throw new GrpcUnauthenticatedException('DOMAIN_IS_UNDEFINED');
            // check if user exists
            const user = await this.User.findOne({ email, domain, is_deleted: false });

            if (!user) throw new GrpcUnauthenticatedException('USER_NOT_FOUND');
            if (!user.is_active) throw new GrpcUnauthenticatedException('USER_NOT_ACTIVE');

            // Check if data is an object with at least one field
            if (typeof data !== 'object' || Object.keys(data).length === 0) {
                return { result: 'no valid data' };
            }

            // update profile
            const updateResult = await this.Profile.updateOne({ _id: user.profile_id }, data);

            if (updateResult.modifiedCount === 0) {
                throw new GrpcInternalException('UPDATE_PROFILE_FAILED');
            } else {
                // update user
                const updateUser = await this.User.updateOne({ _id: user._id }, {username: data['username']});

            if (updateUser.modifiedCount === 0) {
                throw new GrpcInternalException('UPDATE_USERNAME_USER_FAILED');
            }}
            return { result: 'success' };
        } catch (error) {
            throw error;
        }
    }

    async updateTenantProfile(data: IUpdateTenantProfileRequest): Promise<IUpdateTenantProfileResponse> {
        try {
            const tenantExist = await this.TenantProfile.findOne({
                domain: data.user.domain,
                email: data.user.email,
            });
            if (!tenantExist) {
                throw new GrpcUnauthenticatedException('TENANT_NOT_FOUND');
            }
            if (!tenantExist.is_verify) {
                throw new GrpcUnauthenticatedException('TENANT_NOT_VERIFIED');
            }

            const updateTenant = await this.TenantProfile.updateOne({ domain: data.user.domain, email: data.user.email }, data);

            if (updateTenant.modifiedCount === 0) {
                throw new GrpcUnauthenticatedException('TENANT_NOT_UPDATED');
            }

            const updatedTenantProfile = await this.TenantProfile.findOne({
                domain: data.user.domain,
                email: data.user.email,
            });

            return {
                tenantprofile: {
                    ...updateTenant,
                    username: updatedTenantProfile.username,
                    email: updatedTenantProfile.email,
                    phone: updatedTenantProfile.phone,
                    gender: updatedTenantProfile.gender,
                    address: updatedTenantProfile.address,
                    age: updatedTenantProfile.age,
                    avatar: updatedTenantProfile.avatar,
                    name: updatedTenantProfile.name,
                    stage: updatedTenantProfile.stage,
                    companyName: updatedTenantProfile.companyName,
                    companyAddress: updatedTenantProfile.companyAddress,
                    domain: updatedTenantProfile.domain,
                    isVerify: String(updatedTenantProfile.is_verify),
                    createdAt: String(updatedTenantProfile.createdAt),
                },
            };
        }   
        catch (error) {
            throw error;
        }
    }
}
