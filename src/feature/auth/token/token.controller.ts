import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { TokenService } from './token.service';
import {RefreshTokenGuard} from 'src/common/guards/token/refreshToken.guard';
import {AccessTokenGuard} from 'src/common/guards/token/accessToken.guard';

@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  // @UseGuards(RefreshTokenGuard)
  @Get('get')
  async getTokens(userId: string, deviceId: string) {
    return await this.tokenService.getTokens(userId, deviceId);
  }

  // @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(userId: string, refreshToken: string){
    return await this.tokenService.refreshTokens(userId, refreshToken);
  }

}
