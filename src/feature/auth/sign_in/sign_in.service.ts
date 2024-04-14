import { Inject, Injectable } from '@nestjs/common';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';
import { Model } from 'mongoose';
import { User } from 'src/models/user/interface/user.interface';
import { Role } from 'src/common/enums/role.enum';
import { SignInResponse } from 'src/proto_build/auth/sign_in_pb';
import { GrpcUnauthenticatedException } from 'nestjs-grpc-exceptions';
import * as argon from 'argon2';
import { Jwt } from 'src/util/jwt/jwt';

@Injectable()
export class SignInService {
    constructor(
        @Inject(LoggerKey) private logger: Logger,
        @Inject('USER_MODEL') private readonly User: Model<User>,
        private readonly jwtService: Jwt,
    ) {}

    async signIn(data): Promise<SignInResponse> {
        try {
            // Check if user already exists and is active
            const checkUser = await this.User.findOne({
                email: data.email,
                domain: data.domain,
            });

            if (!checkUser) throw new GrpcUnauthenticatedException('USER_NOT_FOUND');
            if (!checkUser.is_active) throw new GrpcUnauthenticatedException('USER_NOT_VERIFIED');

            // Check password
            const isPasswordMatch = await argon.verify(checkUser.password, data.password);
            if (!isPasswordMatch) {
                this.logger.error('Invalid password for user: ' + checkUser.email);
                throw new GrpcUnauthenticatedException('INVALID_PASSWORD');
            }

            // Generate access token and refresh token
            const accessToken = await this.jwtService.createAccessToken(
                checkUser._id,
                checkUser.email,
                checkUser.domain,
                Role.USER,
            );
            const refreshToken = await this.jwtService.createRefreshToken(
                checkUser._id,
                checkUser.email,
                checkUser.domain,
            );

            // Save token to cache
            this.jwtService.saveToken(checkUser.email, checkUser.domain, accessToken, refreshToken);

            return Object.assign(new SignInResponse(), { accessToken, refreshToken });
        } catch (error) {
            throw error;
        }
    }
}
