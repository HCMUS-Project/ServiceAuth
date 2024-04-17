import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign_up.dto';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { User } from 'src/models/user/interfaces/user.interface';
import { validateOrReject, ValidationError } from 'class-validator';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';
import { TokenService } from '../token/token.service';
import { UsersService } from '../../user/users/users.service';
import { Role } from 'src/common/guards/role/role.enum';
import { exceptions } from 'winston';
import { ForbiddenException } from 'src/common/exceptions/exceptions';
import e from 'express';
@Injectable()
export class SignUpService {
    constructor(
        @Inject('SIGN_UP_MODEL') private readonly User: Model<User>,
        @Inject(LoggerKey) private logger: Logger,
        private readonly tokenService: TokenService,
    ) {}

    async signUp(_signUpDto: SignUpDto): Promise<any> {
        try{
            const hashedPassword = await argon.hash(_signUpDto.password);

            // Check if user already exists and is active
            const checkUser = await this.User.findOne({
                email: _signUpDto.email,
                domain: _signUpDto.domain,
            });
            if (checkUser) {
                if (checkUser.is_active === true) {
                    this.logger.error('User already registerd: ' + checkUser.email);
                    throw new ForbiddenException('USER_ALREADY_REGISTER: ' + checkUser.email);
                } else {
                    this.logger.error('User already registerd: ' + checkUser.email);
                    throw new ForbiddenException('USER_ALREADY_REGISTER: ' + checkUser.email);
                }
            }
    
            // Save user to database
            const newUser = new this.User({
                email: _signUpDto.email,
                device: _signUpDto.device,
                domain: _signUpDto.domain,
                password: hashedPassword,
                role: Role.USER,
            });
    
            const user = await newUser.save();
    
            // Generate, save and update hashed refresh_token
            const tokens = await this.tokenService.createAndGetTokens(
                user.user_id,
                _signUpDto.domain,
                user.role,
                _signUpDto.device,
            );
    
            this.tokenService.saveToken(
                tokens.domain,
                tokens.role,
                tokens.device,
                tokens.accessToken,
                tokens.refreshToken,
                user.user_id,
                tokens.accessTokenExpiresAt,
                tokens.refreshTokenExpiresAt,
            );
    
            const new_tokens = await this.tokenService.updateTokens(
                user.user_id,
                tokens.refreshToken,
                true,
            );
    
            return { new_tokens };
        }
        catch (error) {
            this.logger.error('Error while signing up', { error });
            throw error;
        }
    }

    async signUpTenant(_signUpDto: SignUpDto): Promise<any> {
        try {
            const hashedPassword = await argon.hash(_signUpDto.password);

            // Check if user already exists and is active
            const checkUser = await this.User.findOne({
                email: _signUpDto.email,
                domain: _signUpDto.domain,
            });
            if (checkUser) {
                if (checkUser.is_active === true) {
                    throw new ForbiddenException('TENANT_ALREADY_REGISTERED: ' + checkUser.email)
                }
                else {
                    throw new ForbiddenException('USER_ALREADY_REGISTER: ' + checkUser.email);
                }
            }

            // Save user to database
            const newUser = new this.User({
                email: _signUpDto.email,
                device: _signUpDto.device,
                password: hashedPassword,
                role: Role.TENANT,
            });

            const user = await newUser.save();

            // Generate, save and update hashed refresh_token
            const tokens = await this.tokenService.createAndGetTokens(
                user.user_id,
                _signUpDto.domain,
                user.role,
                _signUpDto.device,
            );

            this.tokenService.saveToken(
                tokens.domain,
                tokens.role,
                tokens.device,
                tokens.accessToken,
                tokens.refreshToken,
                user.user_id,
                tokens.accessTokenExpiresAt,
                tokens.refreshTokenExpiresAt,
            );

            const new_tokens = await this.tokenService.updateTokens(
                user.user_id,
                tokens.refreshToken,
                true,
            );

            return { new_tokens };
        } catch (error) {
            throw Error(error);
        }
    }
}
