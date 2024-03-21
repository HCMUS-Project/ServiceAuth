import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { TokenService } from './token.service';
import { RefreshTokenGuard } from 'src/common/guards/token/refreshToken.guard';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';

@Controller('api/token')
export class TokenController {
    constructor(private tokenService: TokenService) {}

    @Get('get')
    async getTokens(userId: string, deviceId: string) {
        return await this.tokenService.getTokens(userId, deviceId);
    }

    @UseGuards(AccessTokenGuard)
    @Get('refresh')
    async refreshTokens(@Request() req) {
        console.log(req);
        const userId = req.user['user_id'];
        const refreshToken = req.user['refreshToken'];
        return this.tokenService.refreshTokens(userId, refreshToken);
    }
}
