import { Inject, Injectable } from '@nestjs/common';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';
import { Document, FilterQuery, Model } from 'mongoose';
import { User } from 'src/models/user/interface/user.interface';
import { Tenant } from 'src/models/tenant/interface/user.interface';
import { GrpcUnauthenticatedException } from 'nestjs-grpc-exceptions';
import * as argon from 'argon2';
import { Jwt } from 'src/util/jwt/jwt';
import {
    IAccountForGenerateToken,
    IChangePasswordRequest,
    IChangePasswordResponse,
    ISignInRequest,
    ISignInResponse,
} from './interface/sign_in.interface';
import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class SignInService {
    constructor(
        @Inject(LoggerKey) private logger: Logger,
        @Inject('USER_MODEL') private readonly User: Model<User>,
        @Inject('TENANT_MODEL') private readonly Tenant: Model<Tenant>,
        private readonly jwtService: Jwt,
    ) {}

    private async authenticateUser(data: ISignInRequest): Promise<ISignInResponse> {
        if (data.domain == undefined) throw new GrpcUnauthenticatedException('DOMAIN_IS_UNDEFINED');

        const user = await this.User.findOne({
            email: data.email,
            domain: data.domain,
        });

        if (!user) throw new GrpcUnauthenticatedException('USER_NOT_FOUND');
        if (!user.is_active) throw new GrpcUnauthenticatedException('USER_NOT_ACTIVE');

        await this.verifyPassword(user.password, data.password, 'user', user.email);
        return this.generateAndSaveTokens(user);
    }

    private async authenticateTenant(data: ISignInRequest): Promise<ISignInResponse> {
        const tenant = await this.Tenant.findOne({
            email: data.email,
        });

        if (!tenant) throw new GrpcUnauthenticatedException('TENANT_NOT_FOUND');
        if (!tenant.is_active) throw new GrpcUnauthenticatedException('TENANT_NOT_ACTIVED');
        if (!tenant.is_verified) throw new GrpcUnauthenticatedException('TENANT_NOT_VERIFIED');

        await this.verifyPassword(tenant.password, data.password, 'tenant', tenant.email);
        return this.generateAndSaveTokens(tenant);
    }

    private async authenticateAdmin(data: ISignInRequest): Promise<ISignInResponse> {
        const admin = await this.User.findOne({
            email: data.email,
            domain: '',
        });

        if (!admin) throw new GrpcUnauthenticatedException('ADMIN_NOT_FOUND');
        if (!admin.is_active) throw new GrpcUnauthenticatedException('ADMIN_NOT_ACTIVE');

        await this.verifyPassword(admin.password, data.password, 'admin', admin.email);
        return this.generateAndSaveTokens(admin);
    }

    private async verifyPassword(
        storedPassword: string,
        submittedPassword: string,
        role: string,
        email: string,
    ): Promise<void> {
        const isPasswordMatch = await argon.verify(storedPassword, submittedPassword);
        if (!isPasswordMatch) {
            this.logger.error(`Invalid password for ${role}: ${email}`);
            throw new GrpcUnauthenticatedException('INVALID_PASSWORD');
        }
    }

    private async generateAndSaveTokens(
        account: IAccountForGenerateToken,
    ): Promise<ISignInResponse> {
        const accessToken = await this.jwtService.createAccessToken(
            account.email,
            account.domain,
            account.role,
        );
        const refreshToken = await this.jwtService.createRefreshToken(
            account.email,
            account.domain,
            account.role,
        );
        this.jwtService.saveToken(account.email, account.domain, accessToken, refreshToken);
        return { accessToken, refreshToken };
    }

    async signIn(data: ISignInRequest): Promise<ISignInResponse> {
        try {
            if (
                data.role === undefined ||
                data.role.toString() === getEnumKeyByEnumValue(Role, Role.USER)
            ) {
                return this.authenticateUser(data);
            } else if (data.role.toString() === getEnumKeyByEnumValue(Role, Role.TENANT)) {
                return this.authenticateTenant(data);
            } else {
                return this.authenticateAdmin(data);
            }
        } catch (error) {
            throw error;
        }
    }

    private async updatePassword<T extends Document>(
        model: Model<T>,
        accountId: T['_id'],
        newPassword: string,
    ): Promise<void> {
        const hashedPassword = await argon.hash(newPassword);
        const newAccount = await model.updateOne({ _id: accountId } as FilterQuery<T>, {
            $set: { password: hashedPassword },
        });
    }

    async changeUserPassword(data: IChangePasswordRequest): Promise<IChangePasswordResponse> {
        const user = await this.User.findOne({
            email: data.user.email,
            domain: data.user.domain,
        });

        if (!user) throw new GrpcUnauthenticatedException('USER_NOT_FOUND');
        if (!user.is_active) throw new GrpcUnauthenticatedException('USER_NOT_ACTIVE');

        await this.verifyPassword(user.password, data.password, 'user', user.email);
        await this.updatePassword(this.User, user.id, data.newPassword);

        return { result: 'User password changed successfully' };
    }

    async changeTenantPassword(data: IChangePasswordRequest): Promise<IChangePasswordResponse> {
        const tenant = await this.Tenant.findOne({
            email: data.user.email,
            domain: data.user.domain,
        });

        if (!tenant) throw new GrpcUnauthenticatedException('TENANT_NOT_FOUND');
        if (!tenant.is_active) throw new GrpcUnauthenticatedException('TENANT_NOT_ACTIVED');
        if (!tenant.is_verified) throw new GrpcUnauthenticatedException('TENANT_NOT_VERIFIED');

        await this.verifyPassword(tenant.password, data.password, 'tenant', tenant.email);
        await this.updatePassword(this.Tenant, tenant.id, data.newPassword);

        return { result: 'Tenant password changed successfully' };
    }

    async changeAdminPassword(data: IChangePasswordRequest): Promise<IChangePasswordResponse> {
        const admin = await this.User.findOne({
            email: data.user.email,
            domain: '',
        });

        if (!admin) throw new GrpcUnauthenticatedException('ADMIN_NOT_FOUND');
        if (!admin.is_active) throw new GrpcUnauthenticatedException('ADMIN_NOT_ACTIVED');

        await this.verifyPassword(admin.password, data.password, 'admin', admin.email);
        await this.updatePassword(this.User, admin.id, data.newPassword);

        return { result: 'Admin password changed successfully' };
    }

    async changePassword(data: IChangePasswordRequest): Promise<IChangePasswordResponse> {
        try {
            if (
                data.user.role === undefined ||
                data.user.role.toString() === getEnumKeyByEnumValue(Role, Role.USER)
            ) {
                return this.changeUserPassword(data);
            } else if (data.user.role.toString() === getEnumKeyByEnumValue(Role, Role.TENANT)) {
                return this.changeTenantPassword(data);
            } else if (data.user.role.toString() === getEnumKeyByEnumValue(Role, Role.ADMIN)) {
                return this.changeAdminPassword(data);
            }
        } catch (error) {
            throw error;
        }
    }
}
