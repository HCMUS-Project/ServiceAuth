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
} from '@nestjs/common';
import { SignInService } from './sign_in.service';
import { signInDto } from './dto/sign_in.dto';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';

@Controller('/api/auth')
export class SignInController {
    constructor(private readonly signInService: SignInService) {}

    @Post('sign-in')
    async signIn(@Body() signInDto: signInDto) {
        return await this.signInService.signIn(signInDto);
    }

    @UseGuards(AccessTokenGuard)
    @Get('sign-out')
    async logout(@Request() req) {
        console.log(req);
        const userId = req.user['sub'];
        await this.signInService.signOut(userId);
        return { message: 'User successfully signed out' };
    }
}
