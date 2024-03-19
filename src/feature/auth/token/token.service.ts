import {Inject, Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {UsersService} from '../users/users.service';
import mongoose, {Model} from 'mongoose';
import {Token} from 'src/models/user/interfaces/token.interface';
import Logger, {LoggerKey} from 'src/core/logger/interfaces/logger.interface';
import {ForbiddenException} from 'src/common/exceptions/exceptions';
import * as argon from 'argon2';
import {User} from 'src/models/user/interfaces/user.interface';
import {addMinutes, addHours} from 'date-fns'; 

@Injectable()
export class TokenService
{
  constructor (
    @Inject('TOKEN_MODEL') private readonly Token: Model<Token>,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(LoggerKey) private logger: Logger, 
  ) { }

  async saveToken (accessToken: string, refreshToken: string,
    userId: mongoose.Types.ObjectId, deviceId: string,
    access_token_expired_at: Date,
    refresh_token_expired_at: Date)
  {
    const newToken = new this.Token({
      access_token: accessToken,
      refresh_token: refreshToken,
      user_id: userId,
      device_id: deviceId,
      access_token_expired_at: access_token_expired_at,
      refresh_token_expired_at: refresh_token_expired_at,
    });

    return await newToken.save();
  }

  async refreshTokens (userId: string, refreshToken: string)
  {
    const token = await this.Token.findById(userId);

    // 
    if (!token || !token.refresh_token)
      throw new ForbiddenException('Refresh token not found', 'Access Denied');
    const refreshTokenMatches = await argon.verify(
      token.refresh_token,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Refresh token not found', 'Access Denied');
    const tokens = await this.getTokens(token.user_id.toString(), token.device_id);
    await this.updateRefreshToken(token.user_id.toString(), tokens.refreshToken);
    return tokens;
  }

  hashData (data: string)
  {
    return argon.hash(data);
  }

  async updateRefreshToken (userId: string, refreshToken: string)
  {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.Token
      .findByIdAndUpdate(userId, {refresh_token: hashedRefreshToken}, {new: true})
      .exec();
  }

  async getTokens (user_id: string, device_id: string)
  {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          user_id,
          device_id,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '5m',
        },
      ),
      this.jwtService.signAsync(
        {
          user_id,
          device_id,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '1h',
        },
      ),
    ]);

    // Calculate expiration times
    const accessTokenExpiresAt = addMinutes(new Date(), 5);
    const refreshTokenExpiresAt = addHours(new Date(), 1);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    };
  }
}
