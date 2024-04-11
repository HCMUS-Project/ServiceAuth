import { Inject, Injectable, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Token } from 'src/models/user/interfaces/token.interface';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';
import {
    BadRequestException,
    ForbiddenException,
    InvalidPasswordException,
    UserNotFoundException,
    ValidationFailedException,
} from 'src/common/exceptions/exceptions';
import * as argon from 'argon2';
import { addMinutes, addHours } from 'date-fns';
import { Role } from 'src/common/guards/role/role.enum';

@Injectable()
export class TokenService {
    constructor(
        @Inject('TOKEN_MODEL') private readonly Token: Model<Token>,
        private jwtService: JwtService,
        private configService: ConfigService,
        @Inject(LoggerKey) private logger: Logger,
    ) {}

    async createAccessToken(user_id: string, domain: String, role: Role, device: string) {
        const accessToken = await this.jwtService.signAsync(
            {
                user_id,
                domain,
                role,
                device,
            },
            {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: '15m',
            },
        );
        return accessToken;
    }

    async createRefreshToken(user_id: string, domain: String, role: Role, device: string) {
        const refreshToken = await this.jwtService.signAsync(
            {
                user_id,
                domain,
                role,
                device,
            },
            {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            },
        );
        return refreshToken;
    }

    async saveToken(
        domain: string,
        role: Role,
        device: string,
        accessToken: string,
        refreshToken: string,
        userId: string,
        access_token_expired_at: Date,
        refresh_token_expired_at: Date,
    ) {
        try {
            const newToken = new this.Token({
                domain: domain,
                role: role,
                device: device,
                access_token: accessToken,
                refresh_token: refreshToken,
                user_id: userId,
                access_token_expired_at,
                refresh_token_expired_at,
            });
            return await newToken.save();
        } catch (error) {
            this.logger.error('Error while saving token', { error });
            throw new BadRequestException('Error while saving token', error.toString());
        }
    }

    async refreshTokens(@Request() req){
        const userId = req.user['user_id'];
        const refreshToken = req.user['refreshToken'];
        try {
            const token = await this.Token.findOne({ user_id: userId });

            if (!token || !token.refresh_token) {
                throw new UserNotFoundException('Refresh token not found');
            }

            const refreshTokenMatches = await argon.verify(token.refresh_token, refreshToken);
            if (!refreshTokenMatches) {
                throw new InvalidPasswordException('Refresh token does not match');
            }

            const tokens = await this.createAndGetTokens(
                token.user_id.toString(),
                token.domain,
                token.role as Role,
                token.device,
            );
            await this.updateTokens(token.user_id.toString(), tokens.refreshToken, true);
            return tokens;
        } catch (error) {
            if (
                error instanceof UserNotFoundException ||
                error instanceof InvalidPasswordException
            ) {
                this.logger.error('Error while refreshing tokens', { error });
                throw error;
            }
            throw new ValidationFailedException('Error while refreshing tokens', error.toString());
        }
    }

    async updateTokens(userId: string, refreshToken: string, isHashed = false) {
        try {
            let value;
            if (isHashed === false || refreshToken === null) {
                value = refreshToken;
            } else {
                value = await argon.hash(refreshToken);
            }

            return await this.Token.findOneAndUpdate(
                { user_id: userId },
                { refresh_token: value },
                { new: true },
            ).exec();
        } catch (error) {
            this.logger.error('Error while updating refresh token', { error });
            throw new BadRequestException('Error while updating refresh token', error.toString());
        }
    }

    async createAndGetTokens(user_id: string, domain: string, role: Role, device: string) {
        try {
            const [accessToken, refreshToken] = await Promise.all([
                this.createAccessToken(user_id, domain, role, device),
                this.createRefreshToken(user_id, domain, role, device),
            ]);

            const accessTokenExpiresAt = addMinutes(new Date(), 15);
            const refreshTokenExpiresAt = addHours(new Date(), 168);

            await this.Token.findOneAndUpdate(
                { user_id, device, domain },
                {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    access_token_expired_at: accessTokenExpiresAt,
                    refresh_token_expired_at: refreshTokenExpiresAt,
                },
                { new: true },
            ).exec();

            return {
                user_id,
                domain,
                role,
                device,
                accessToken,
                refreshToken,
                accessTokenExpiresAt,
                refreshTokenExpiresAt,
            };
        } catch (error) {
            this.logger.error('Error while getting tokens', { error });
            throw new BadRequestException('Error while getting tokens', error.toString());
        }
    }
}
