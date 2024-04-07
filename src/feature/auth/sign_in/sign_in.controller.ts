import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { SignInService } from './sign_in.service';
import { SignInDto } from './dto/sign_in.dto';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';

@Controller('')
export class SignInController {
    constructor(private readonly signInService: SignInService) {}

    @Post('sign-in')
    async signIn(@Body() signInDto: SignInDto) {
        return await this.signInService.signIn(signInDto);
    }

    @UseGuards(AccessTokenGuard)
    @Get('sign-out')
    async signOut(@Request() req) {
        return await this.signInService.signOut(req);
    }

    @UseGuards(AccessTokenGuard)
    @Post('change-password')
    async changePassword(@Request() req, @Body() changePasswordDto) {
        return await this.signInService.changePassword(req, changePasswordDto);
    }
}
