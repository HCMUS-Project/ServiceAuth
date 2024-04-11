import { Injectable, Inject, Request } from '@nestjs/common';
import { SignInDto } from './dto/sign_in.dto';
import { User } from 'src/models/user/interfaces/user.interface';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { isHash, validateOrReject, ValidationError } from 'class-validator';
import {
    UserNotFoundException,
    InvalidPasswordException,
    ValidationFailedException,
    UnActivatedUserException,
    BadRequestException,
} from '../../../common/exceptions/exceptions';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';
import { TokenService } from '../token/token.service';
import { ChangePasswordDto } from './dto/change_password';

@Injectable()
export class SignInService {
    constructor(
        @Inject('USER_MODEL') private readonly User: Model<User>,
        @Inject(LoggerKey) private logger: Logger,
        private readonly tokenService: TokenService,
    ) {}

    async signIn(_signInDto: SignInDto): Promise<any> {
        try {
            const user = await this.User.findOne({ email: _signInDto.email }).select('+password');

            // Check if user exists
            if (!user) {
                this.logger.error('User not found for email: ' + _signInDto.email);
                throw new UserNotFoundException('User not found for email: ' + _signInDto.email);
            }

            // Check if user is active
            if (user.is_active === false) {
                this.logger.error('User is not active: ' + _signInDto.email);
                throw new UnActivatedUserException('User is not active: ' + _signInDto.email);
            }

            const isPasswordMatch = await argon.verify(user.password, _signInDto.password);

            // Check if password is correct
            if (!isPasswordMatch) {
                this.logger.error('Invalid password for user: ' + user.email);
                throw new InvalidPasswordException('Invalid password for user: ' + user.email);
            }

            // Generate tokens
            const tokens = await this.tokenService.createAndGetTokens(
                user.user_id,
                _signInDto.domain,
                user.role,
                _signInDto.device,
            );
            const update_tokens = await this.tokenService.updateTokens(
                user.user_id,
                tokens.refreshToken,
                true,
            );

            return { tokens };
        } catch (error) {
            this.logger.error('Error while signing in', { error });
            throw error;
        }
    }

    async signOut(@Request() req) {
        try {
            const userId = req.user['user_id'];
            const update_token = await this.tokenService.updateTokens(userId, null, false);
            return {
                message: 'User successfully signed out',
                token: update_token,
            };
        } catch (error) {
            this.logger.error('Error while signing out', { error });
            throw new BadRequestException('Error while signing out', error.toString());
        }
    }

    async changePassword(@Request() req, changePasswordDto: ChangePasswordDto) {
        try {
            const user = await this.User.findOne({ email: changePasswordDto.email }).select(
                '+password',
            );
            if (!user) {
                this.logger.error('User not found for user_id: ' + changePasswordDto.email);
                throw new UserNotFoundException(
                    'User not found for user_id: ' + changePasswordDto.email,
                );
            }

            const isPasswordMatch = await argon.verify(
                user.password,
                changePasswordDto.oldPassword,
            );

            if (!isPasswordMatch) {
                this.logger.error('Invalid password for user: ' + user.email);
                throw new InvalidPasswordException('Invalid password for user: ' + user.email);
            }

            const hashedPassword = await argon.hash(changePasswordDto.newPassword);
            const isPasswordChange = (
                await this.User.updateOne(
                    { email: changePasswordDto.email },
                    { password: hashedPassword },
                )
            ).acknowledged;

            return isPasswordChange;
        } catch (error) {
            this.logger.error('Error while changing password', { error });
            throw new BadRequestException('Error while changing password', error.toString());
        }
    }
}
