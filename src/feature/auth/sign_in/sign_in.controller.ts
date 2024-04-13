import {
    Controller,
    Get,
    Post,
    Body,
    Request,
    Patch,
    Param,
    Delete,
    UseGuards,
    HttpStatus,
} from '@nestjs/common';
import { SignInService } from './sign_in.service';
import { signInDto } from './dto/sign_in.dto';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { GrpcMethod } from '@nestjs/microservices';
import { ISignInResponse } from './interfaces/sign-in-response.interface';
import { User_ShortToken } from '../interface/user_token.interface';
import { User } from '../interface/user.interface';
import { ShortToken } from '../interface/token.interface';
import { timestamp } from 'rxjs';

@Controller('auth')
export class SignInController {
    constructor(private readonly _signInService: SignInService) {
        // console.log('30');
    }

    @GrpcMethod('AuthService')
    async SignInService(data: signInDto): Promise<any> {
        console.log('Into signIn');
        // const user_token = await this._signInService.signIn(data)
        const user_token = {
            user: {
                _id: '6618dd64cdc42f8ada8356c7',
                email: 'vukhoi@gmail.com',
                password:
                    '$argon2id$v=19$m=65536,t=3,p=4$faCtfk3IB+bBNFR2xGFluA$eWHWK0CU7VMV1UgFOyUw4spOeARD25kxL9rU4ess+Gw',
                is_deleted: false,
                is_active: true,
                user_id: '5379fefd-bcbd-4a6e-ad08-50cfab03a563',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                __v: 0,
            },
            shortToken: {
                access_token:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTM3OWZlZmQtYmNiZC00YTZlLWFkMDgtNTBjZmFiMDNhNTYzIiwiZGV2aWNlX2lkIjoid2ViIiwiaWF0IjoxNzEyOTA1NjQzLCJleHAiOjE3MTI5MDY1NDN9.fS3zdxM8NQXcUWGEHq6yPfzN3X-Bg88v3evaiKrKqag',
                refresh_token:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTM3OWZlZmQtYmNiZC00YTZlLWFkMDgtNTBjZmFiMDNhNTYzIiwiZGV2aWNlX2lkIjoid2ViIiwiaWF0IjoxNzEyOTA1NjQzLCJleHAiOjE3MTI5OTIwNDN9.8mPYR2MtlYRkjqvGHDLDkkksnrnfQTRg3wF5Y1tsLp0',
                access_token_expired_at: new Date().toISOString(),
                refresh_token_expired_at: new Date().toISOString(),
            },
        };

        const User_Token = {
            user: user_token.user as User,
            shortToken: user_token.shortToken as ShortToken,
        } as User_ShortToken;
        console.log(User_Token);
        return {
            statusCode: User_Token ? HttpStatus.OK : HttpStatus.UNAUTHORIZED,
            message: User_Token ? 'Sign_in_success' : 'Sign_in_unsuccessfully',
            user_token: {
                shortToken: {
                    access_token:
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTM3OWZlZmQtYmNiZC00YTZlLWFkMDgtNTBjZmFiMDNhNTYzIiwiZGV2aWNlX2lkIjoid2ViIiwiaWF0IjoxNzEyOTA1NjQzLCJleHAiOjE3MTI5MDY1NDN9.fS3zdxM8NQXcUWGEHq6yPfzN3X-Bg88v3evaiKrKqag',
                    refresh_token:
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTM3OWZlZmQtYmNiZC00YTZlLWFkMDgtNTBjZmFiMDNhNTYzIiwiZGV2aWNlX2lkIjoid2ViIiwiaWF0IjoxNzEyOTA1NjQzLCJleHAiOjE3MTI5OTIwNDN9.8mPYR2MtlYRkjqvGHDLDkkksnrnfQTRg3wF5Y1tsLp0',
                    access_token_expired_at: new Date().toISOString(),
                    refresh_token_expired_at: new Date().toISOString(),
                },
                user: {
                    _id: '6618dd64cdc42f8ada8356c7',
                    email: 'vukhoi@gmail.com',
                    password:
                        '$argon2id$v=19$m=65536,t=3,p=4$faCtfk3IB+bBNFR2xGFluA$eWHWK0CU7VMV1UgFOyUw4spOeARD25kxL9rU4ess+Gw',
                    is_deleted: false,
                    is_active: true,
                    user_id: '5379fefd-bcbd-4a6e-ad08-50cfab03a563',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    __v: 0,
                },
            },
        };

        // @UseGuards(AccessTokenGuard)
        // @Get('sign-out')
        // async signOut (@Request() req)
        // {
        //     return await this.signInService.signOut(req);
        // }

        // @UseGuards(AccessTokenGuard)
        // @Post('change-password')
        // async changePassword (@Request() req, @Body() changePasswordDto)
        // {
        //     return await this.signInService.changePassword(req, changePasswordDto);
        // }
    }
}
