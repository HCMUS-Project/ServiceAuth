import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SignUpService } from './sign_up.service';
import { SignUpDto } from './dto/sign_up.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('')
export class SignUpController {
    constructor(private signUpService: SignUpService) {}

    @Post('sign-up')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.signUpService.signUp(signUpDto);
    }
}
