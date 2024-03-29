import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign_up.dto';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { User } from 'src/models/user/interfaces/user.interface';
import { validateOrReject, ValidationError } from 'class-validator';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';
import { ForbiddenException } from 'src/common/exceptions/exceptions';
import { TokenService } from '../token/token.service';
import { UsersService } from '../../user/users/users.service';

@Injectable()
export class SignUpService {
    constructor(
        @Inject('SIGN_UP_MODEL') private readonly User: Model<User>,
        @Inject(LoggerKey) private logger: Logger,
        private readonly tokenService: TokenService,
    ) {}

    async signUp(_signUpDto: SignUpDto): Promise<any> {
        try {
            const hashedPassword = await argon.hash(_signUpDto.password);

            // Check if user already exists and is active
            const checkUser = await this.User.findOne({ email: _signUpDto.email });
            if (checkUser) {
                if (checkUser.is_active === true) {
                    throw new ForbiddenException(
                        'USER_ALREADY_REGISTERED',
                        'User is already registered. But not activated yet. Please activate your account.',
                    );
                } else {
                    throw new ForbiddenException('USER_ALREADY_REGISTERD', 'User already exists');
                }
            }

            // Save user to database
            const newUser = new this.User({
                email: _signUpDto.email,
                device: _signUpDto.device,
                password: hashedPassword,
            });

            const user = await newUser.save();

            // Generate, save and update hashed refresh_token
            const tokens = await this.tokenService.getTokens(user.user_id, _signUpDto.device);

            const save_token = await this.tokenService.saveToken(
                tokens.accessToken,
                tokens.refreshToken,
                user.user_id,
                _signUpDto.device,
                tokens.accessTokenExpiresAt,
                tokens.refreshTokenExpiresAt,
            );

            const new_tokens = await this.tokenService.updateRefreshToken(
                user.user_id,
                tokens.refreshToken,
                true,
            );

            return { new_tokens };
        } catch (error) {
            this.logger.error('Error while signing up user', { error });
            throw error;
        }
    }
}
