import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { GrpcUnauthenticatedException } from 'nestjs-grpc-exceptions';
import { Jwt } from 'src/util/jwt/jwt';
import { IRefreshTokenResponse } from './interface/refresh_token.interface';
import { IUserToken } from 'src/common/interfaces/user_token.interface';

@Injectable()
export class RefreshTokenService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
        private readonly jwtService: Jwt,
    ) {}

    async refreshToken(user: IUserToken, refreshToken: string): Promise<IRefreshTokenResponse> {
        try {
            // check if the refresh token is valid
            console.log(user);
            console.log(refreshToken);

            let refreshTokenCache = await this.cacheManager.get(
                `refresh_token:${user.email}/${user.domain}/${refreshToken}`,
            );

            if (!refreshTokenCache) {
                throw new GrpcUnauthenticatedException('INVALID_REFRESH_TOKEN');
            }

            // check decode the refresh token
            let payloadRefreshToken = await this.jwtService.verifyToken(refreshToken, false);
            if (!payloadRefreshToken) {
                throw new GrpcUnauthenticatedException('REFRESH_TOKEN_EXPIRED');
            }

            // Generate access token and refresh token
            const accessTokenNew = await this.jwtService.createAccessToken(
                user.email,
                user.domain,
                user.role,
            );

            const refreshTokenNew = await this.jwtService.createRefreshToken(
                user.email,
                user.domain,
                user.role,
            );

            // Save token to cache
            this.jwtService.saveToken(user.email, user.domain, accessTokenNew, refreshTokenNew);

            // Delete old refresh token
            this.cacheManager.del(`refresh_token:${user.email}/${user.domain}/${refreshToken}`);

            return {
                accessToken: accessTokenNew,
                refreshToken: refreshTokenNew,
            };
        } catch (error) {
            throw error;
        }
    }
}
