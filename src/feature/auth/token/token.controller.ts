import { Controller, Get, UseGuards, Request, Body } from '@nestjs/common';
import { TokenService } from './token.service';
import { RefreshTokenGuard } from 'src/common/guards/token/refreshToken.guard';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { sign } from 'crypto';
import { SignInDto } from '../sign_in/dto/sign_in.dto';

@Controller('api/token')
export class TokenController {
    constructor(private tokenService: TokenService) {}

    @UseGuards(RefreshTokenGuard)
    @Get('refresh-tokens')
    async refreshTokens(@Request() req) {
        return this.tokenService.refreshTokens(req);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('access-tokens')
    async accessTokens(@Body() user_id: string, domain: string, role: string, device: string) {
        return this.tokenService.getAccessToken(user_id, domain, role, device);
    }
}
