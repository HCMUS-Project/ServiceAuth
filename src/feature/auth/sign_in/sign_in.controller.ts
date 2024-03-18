import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SignInService } from './sign_in.service';
import { signInDto } from './dto/sign_in.dto';

@Controller('/api/auth')
export class SignInController {
    constructor(private readonly signInService: SignInService) {}

    @Post('sign-in')
    async signIn(@Body() signInDto: signInDto) {
        return await this.signInService.signIn(signInDto);
    }
}
