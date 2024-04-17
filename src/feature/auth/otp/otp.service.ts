import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { OtpDto } from './dto/otp.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheStore } from '@nestjs/cache-manager';
import { Model } from 'mongoose';
import { User } from 'src/models/user/interfaces/user.interface';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';
import { UserNotFoundException } from '../../../common/exceptions/exceptions';

@Injectable()
export class OtpService {
    constructor(
        private readonly mailerService: MailerService,
        @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
        @Inject('USER_MODEL') private readonly User: Model<User>,
        @Inject(LoggerKey) private logger: Logger,
    ) {}

    generateOTP() {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async sendOtpEmail(otpDto: OtpDto): Promise<void> {
        try {
            if (!otpDto.email) {
                throw new Error('Email is not provided.');
            }
            const generate_otp = this.generateOTP();

            await this.cacheManager.set(`otp_${otpDto.domain}_${otpDto.email}`, `${generate_otp}`, { ttl: 600 });

            const response = await this.mailerService.sendMail({
                to: otpDto.email,
                subject: 'Your OTP',
                text: `Your One Time Password (OTP): ${generate_otp}`,
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    async checkOtpValid(otpDto: OtpDto): Promise<boolean> {
        const savedOtp = await this.cacheManager.get(`otp_${otpDto.domain}_${otpDto.email}`);
        const isOtpValid = savedOtp === otpDto.otp;
        return isOtpValid;
    }

    async activeAccount(otpDto: OtpDto): Promise<boolean> {
        const isOtpValid = this.checkOtpValid(otpDto);

        let isAccountActive = false;
        if (isOtpValid) {
            const user = await this.User.findOne({ email: otpDto.email, domain: otpDto.domain }).select('+password');
            if (!user) {
                this.logger.error('User not found for email: ' + otpDto.email);
                throw new UserNotFoundException('User not found for email: ' + otpDto.email);
            } else {
                const result = await this.User.updateOne(
                    { email: otpDto.email, domain: otpDto.domain},
                    { is_active: true },
                );
                isAccountActive = result.acknowledged;
            }
            await this.cacheManager.del(`otp_${otpDto.domain}_${otpDto.email}`);
        }
        return isAccountActive;
    }

    async recoverPassword(otpDto: OtpDto, new_password: string): Promise<boolean> {
        const isOtpValid = this.checkOtpValid(otpDto);
        let isPasswordChange = false;
        if (isOtpValid) {
            const user = await this.User.findOne({ email: otpDto.email, domain: otpDto.domain }).select('+password');
            if (!user) {
                this.logger.error('User not found for email: ' + otpDto.email);
                throw new UserNotFoundException('User not found for email: ' + otpDto.email);
            } else {
                const result = await this.User.updateOne(
                    { email: otpDto.email, domain: otpDto.domain },
                    { password: new_password },
                );
                isPasswordChange = result.acknowledged;
            }
            await this.cacheManager.del(`otp_${otpDto.domain}_${otpDto.email}`);
        }
        return isPasswordChange;
    }
}
