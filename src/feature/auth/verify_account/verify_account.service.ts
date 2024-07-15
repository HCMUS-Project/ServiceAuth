import { Inject, Injectable } from '@nestjs/common';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';
import { Model } from 'mongoose';
import { User } from 'src/models/user/interface/user.interface';
import { GrpcUnauthenticatedException } from 'nestjs-grpc-exceptions';
import { generateOtp } from 'src/common/otp/otp';
import * as argon from 'argon2';
import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import {
    IForgotPasswordRequest,
    IForgotPasswordResponse,
    ISendMailRequest,
    ISendMailResponse,
    IVerifyAccountRequest,
    IVerifyAccountResponse,
} from './interface/verify_account.interface';
import { Tenant } from 'src/models/tenant/interface/user.interface';
import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';
import { Role } from 'src/common/enums/role.enum';
import { AccountType } from 'src/common/enums/accountType.enum';

@Injectable()
export class VerifyAccountService {
    constructor(
        private readonly mailerService: MailerService,
        @Inject(LoggerKey) private logger: Logger,
        @Inject('USER_MODEL') private readonly User: Model<User>,
        @Inject('TENANT_MODEL') private readonly Tenant: Model<Tenant>,
        @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    ) {}

    private getModel(accountType: AccountType): Model<User | Tenant> {
        switch (accountType) {
            case AccountType.User:
            case AccountType.Admin:
                return this.User;
            case AccountType.Tenant:
                return this.Tenant;
            default:
                throw new GrpcUnauthenticatedException('INVALID_ACCOUNT_TYPE');
        }
    }

    async verifyAccountType(data: IVerifyAccountRequest, accountType: AccountType) {
        const model = this.getModel(accountType);

        // If Admin or Tenant, domain is "", cause new account Tenant dont have domain
        if (accountType === 'Admin' || accountType === 'Tenant') {
            data.domain = '';
        } else if (accountType === 'User') {
            // Check if User, domain must have value
            if (data.domain == undefined)
                throw new GrpcUnauthenticatedException('DOMAIN_IS_UNDEFINED');
        }

        // Check if the account exists
        let account = await model.findOne({
            email: data.email,
            domain: data.domain,
        });

        if (!account) {
            throw new GrpcUnauthenticatedException(`${accountType.toUpperCase()}_NOT_FOUND`);
        }

        if (account.is_active) {
            throw new GrpcUnauthenticatedException(`${accountType.toUpperCase()}_ALREADY_VERIFIED`);
        }

        // Check OTP
        const otp = await this.cacheManager.get(`otp:${data.email}/${data.domain}`);

        if (!otp) throw new GrpcUnauthenticatedException('OTP_EXPIRED');
        if (otp !== data.otp) throw new GrpcUnauthenticatedException('OTP_INVALID');

        // Update account
        await model.updateOne(
            {
                email: data.email,
                domain: data.domain,
            },
            {
                is_active: true,
            },
        );

        return { result: 'success' };
    }

    async resetPasswordType(data: IForgotPasswordRequest, accountType: AccountType) {
        const model = this.getModel(accountType);
        const domain = data.domain;
        if (accountType === 'Admin' || accountType === 'Tenant') {
            data.domain = '';
        } else if (accountType === 'User') {
            // Check if User, domain must have value
            if (data.domain == undefined)
                throw new GrpcUnauthenticatedException('DOMAIN_IS_UNDEFINED');
        }

        // Check if the account exists
        let account: User | Tenant | null;
        if (data.domain === '') {
            account = await model.findOne({
                email: data.email,
            });
            if (account) {
                data.domain = account.domain;
            }
        } else {
            account = await model.findOne({
                email: data.email,
                domain: data.domain,
            });
        }

        if (!account) {
            throw new GrpcUnauthenticatedException(`${accountType.toUpperCase()}_NOT_FOUND`);
        }

        // Check OTP
        const otp = await this.cacheManager.get(`otp:${data.email}/resetpassword`);

        if (!otp) throw new GrpcUnauthenticatedException('OTP_EXPIRED');
        if (otp !== data.otp) throw new GrpcUnauthenticatedException('OTP_INVALID');

        // Update account
        const hashpassword = await argon.hash(data.newpassword);
        await model.updateOne(
            {
                email: data.email,
                domain: data.domain,
            },
            {
                password: hashpassword,
            },
        );
        await this.cacheManager.del(`otp:${data.email}/resetpassword`);

        return { result: 'success' };
    }

    async verifyAccount(data: IVerifyAccountRequest): Promise<IVerifyAccountResponse> {
        try {
            let accountType: AccountType;
            if (
                data.role === undefined ||
                data.role.toString() === getEnumKeyByEnumValue(Role, Role.USER)
            ) {
                accountType = AccountType.User;
            } else if (data.role.toString() === getEnumKeyByEnumValue(Role, Role.TENANT)) {
                accountType = AccountType.Tenant;
            } else if (data.role.toString() === getEnumKeyByEnumValue(Role, Role.ADMIN)) {
                accountType = AccountType.Admin;
            }
            console.log(accountType);
            return this.verifyAccountType(data, accountType);
        } catch (error) {
            throw error;
        }
    }

    async forgotPassword(data: IForgotPasswordRequest): Promise<IForgotPasswordResponse> {
        try {
            let accountType: AccountType;
            if (
                data.role === undefined ||
                data.role.toString() === getEnumKeyByEnumValue(Role, Role.USER)
            ) {
                accountType = AccountType.User;
            } else if (data.role.toString() === getEnumKeyByEnumValue(Role, Role.TENANT)) {
                accountType = AccountType.Tenant;
            } else if (data.role.toString() === getEnumKeyByEnumValue(Role, Role.ADMIN)) {
                accountType = AccountType.Admin;
            }
            console.log(data.newpassword, data.email, data.domain);
            return this.resetPasswordType(data, accountType);
        } catch (error) {
            throw error;
        }
    }

    async sendMailOtpType(data: ISendMailRequest, accountType: AccountType) {
        const model = this.getModel(accountType);

        // If Admin or Tenant, domain is "", cause new account Tenant dont have domain
        if (accountType === 'Admin' || accountType === 'Tenant') {
            data.domain = '';
        } else if (accountType === 'User') {
            // Check if User, domain must have value
            if (data.domain == undefined)
                throw new GrpcUnauthenticatedException('DOMAIN_IS_UNDEFINED');
        }
        console.log(data.email, data.domain);
        // Check if the account exists
        let account = await model.findOne({
            email: data.email,
            domain: data.domain,
        });

        if (!account) {
            throw new GrpcUnauthenticatedException(`${accountType.toUpperCase()}_NOT_FOUND`);
        }

        if (account.is_active) {
            throw new GrpcUnauthenticatedException(`${accountType.toUpperCase()}_ALREADY_VERIFIED`);
        }

        // Generate OTP
        const otp = generateOtp(6);
        this.cacheManager.set(`otp:${data.email}/${data.domain}`, otp, { ttl: 300 });

        // Send OTP to account
        await this.mailerService.sendMail({
            to: data.email,
            subject: 'OTP verify account',
            text: `Your OTP is: ${otp}`,
        });

        return { result: 'success' };
    }

    async sendMailOtp(data: ISendMailRequest): Promise<ISendMailResponse> {
        try {
            let accountType: AccountType;
            if (
                data.role === undefined ||
                data.role.toString() === getEnumKeyByEnumValue(Role, Role.USER)
            ) {
                accountType = AccountType.User;
            } else if (data.role.toString() === getEnumKeyByEnumValue(Role, Role.TENANT)) {
                accountType = AccountType.Tenant;
            } else if (data.role.toString() === getEnumKeyByEnumValue(Role, Role.ADMIN)) {
                accountType = AccountType.Admin;
            }

            return this.sendMailOtpType(data, accountType);
        } catch (error) {
            throw error;
        }
    }

    async sendMailOtpForgotPasswordType(data: ISendMailRequest, accountType: AccountType) {
        const model = this.getModel(accountType);
        console.log(model, '------------------');
        // If Admin or Tenant, domain is "", cause new account Tenant dont have domain
        if (accountType === 'Admin' || accountType === 'Tenant') {
            data.domain = '';
        } else if (accountType === 'User') {
            // Check if User, domain must have value
            if (data.domain == undefined)
                throw new GrpcUnauthenticatedException('DOMAIN_IS_UNDEFINED');
        }

        // Check if the account exists
        console.log(data.email, data.domain);
        let account = '';
        if (data.domain === '') {
            account = await model.findOne({
                email: data.email,
            });
        } else {
            account = await model.findOne({
                email: data.email,
                domain: data.domain,
            });
        }

        if (!account) {
            throw new GrpcUnauthenticatedException(`${accountType.toUpperCase()}_NOT_FOUND`);
        }

        // Generate OTP
        const otp = generateOtp(6);
        this.cacheManager.set(`otp:${data.email}/resetpassword`, otp, { ttl: 300 });

        // Send OTP to account
        await this.mailerService.sendMail({
            to: data.email,
            subject: 'OTP change password',
            text: `Your OTP is: ${otp}`,
        });

        return { result: 'success' };
    }

    async sendMailForgotPassword(data: ISendMailRequest): Promise<ISendMailResponse> {
        try {
            let accountType: AccountType;
            if (
                data.role === undefined ||
                data.role.toString() === getEnumKeyByEnumValue(Role, Role.USER)
            ) {
                accountType = AccountType.User;
            } else if (data.role.toString() === getEnumKeyByEnumValue(Role, Role.TENANT)) {
                accountType = AccountType.Tenant;
            } else if (data.role.toString() === getEnumKeyByEnumValue(Role, Role.ADMIN)) {
                accountType = AccountType.Admin;
            }

            return this.sendMailOtpForgotPasswordType(data, accountType);
        } catch (error) {
            throw error;
        }
    }
}
