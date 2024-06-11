import { Inject } from '@nestjs/common';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';
import { Model } from 'mongoose';
import { User } from 'src/models/user/interface/user.interface';
import { Profile } from 'src/models/user/interface/profile.interface';
import { Tenant } from 'src/models/tenant/interface/user.interface';
import { TenantProfile } from 'src/models/tenant/interface/profile.interface';
import { GrpcInvalidArgumentException, GrpcUnauthenticatedException } from 'nestjs-grpc-exceptions';
import * as argon from 'argon2';
import { Role } from 'src/common/enums/role.enum';
import { ISignUpRequest, ISignUpResponse } from './interface/sign_up.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { generateOtp } from 'src/common/otp/otp';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { getEnumKeyByEnumValue } from 'src/util/convert_enum/get_key_enum';

export class SignUpService {
    constructor(
        @Inject(LoggerKey) private logger: Logger,
        @Inject('USER_MODEL') private readonly User: Model<User>,
        @Inject('PROFILE_MODEL') private readonly Profile: Model<Profile>,
        @Inject('TENANT_MODEL') private readonly Tenant: Model<Tenant>,
        @Inject('TENANTPROFILE_MODEL') private readonly TenantProfile: Model<TenantProfile>,
        @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
        private readonly mailerService: MailerService,
    ) {}

    async signUp(data: ISignUpRequest): Promise<ISignUpResponse> {
        this.logger.debug('signUp', { props: data });

        try {
            if (
                data.role === undefined ||
                data.role.toString() === getEnumKeyByEnumValue(Role, Role.USER)
            ) {
                // Check if user already exists and is active
                const checkUser = await this.User.findOne({
                    email: data.email,
                    domain: data.domain,
                });
                if (checkUser) throw new GrpcUnauthenticatedException('USER_ALREADY_REGISTER');

                // Save profile user
                const newProfile = new this.Profile({
                    username: data.username,
                    phone: data.phone,
                    address: '123 abc, phuong X, quan Y, thanh pho Z',
                    age: 18,
                    gender: 'other',
                    avatar: 'none',
                    name: 'Nguyen Van A',
                });

                await newProfile.save();
                // Save user to database
                const newUser = new this.User({
                    email: data.email,
                    username: data.username,
                    password: await argon.hash(data.password),
                    domain: data.domain,
                    role: Role.USER,
                    profile_id: newProfile.id,
                });

                await newUser.save();

                // if everything is ok, send mail to verify account
                const otp = generateOtp(6);
                this.cacheManager.set(`otp:${data.email}/${data.domain}`, otp, { ttl: 300 });

                await this.mailerService.sendMail({
                    to: data.email,
                    subject: 'OTP verify account',
                    text: `Your OTP is ${otp}`,
                });

                return { result: 'success' };
            } else {
                // Check if user already exists and is active
                const checkUser = await this.Tenant.findOne({
                    email: data.email,
                    domain: data.domain,
                });
                if (checkUser) throw new GrpcUnauthenticatedException('TENANT_ALREADY_REGISTER');

                // Save profile user
                const newProfile = new this.TenantProfile({
                    domain: data.domain,
                    username: data.username,
                    email: data.email,
                    phone: data.phone,
                    address: '123 abc, phuong X, quan Y, thanh pho Z',
                    age: 18,
                    gender: 'unknown',
                    avatar: 'none',
                    name: 'Nguyen Van A',
                });

                await newProfile.save();
                // Save user to database
                const newUser = new this.Tenant({
                    email: data.email,
                    username: data.username,
                    password: await argon.hash(data.password),
                    domain: data.domain,
                    role: Role.TENANT,
                    profile_id: newProfile.id,
                });

                await newUser.save();

                // if everything is ok, send mail to verify account
                const otp = generateOtp(6);
                this.cacheManager.set(`otp:${data.email}/${data.domain}`, otp, { ttl: 300 });

                await this.mailerService.sendMail({
                    to: data.email,
                    subject: 'OTP verify account',
                    text: `Your OTP is ${otp}`,
                });

                return { result: 'success' };
            }
        } catch (error) {
            // catch error E11000 duplicate key
            if (error.code === 11000) {
                throw new GrpcInvalidArgumentException('EMAIL_ALREADY_REGISTER');
            }

            this.logger.error('signUp', { props: error });
            throw error;
        }
    }
}
