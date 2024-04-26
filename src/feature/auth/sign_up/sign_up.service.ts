import { Inject } from '@nestjs/common';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';
import { Model } from 'mongoose';
import { User } from 'src/models/user/interface/user.interface';
import { Profile } from 'src/models/user/interface/profile.interface';
import { GrpcUnauthenticatedException } from 'nestjs-grpc-exceptions';
import * as argon from 'argon2';
import { Role } from 'src/common/enums/role.enum';
import { ISignUpRequest, ISignUpResponse } from './interface/sign_up.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { generateOtp } from 'src/common/otp/otp';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

export class SignUpService {
    constructor(
        @Inject(LoggerKey) private logger: Logger,
        @Inject('USER_MODEL') private readonly User: Model<User>,
        @Inject('PROFILE_MODEL') private readonly Profile: Model<Profile>,
        @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
        private readonly mailerService: MailerService,
    ) {}

    async signUp(data: ISignUpRequest): Promise<ISignUpResponse> {
        this.logger.debug('signUp', { props: data });

        try {
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
                address: "",
                age: -1,
                gender: "",
                avatar: '',
                name: "",
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
        } catch (error) {
            this.logger.error('signUp', { props: error });
            throw error;
        }
    }
}
