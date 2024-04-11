import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { SignUpService } from './sign_up.service';
import { SignUpDto } from './dto/sign_up.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/guards/role/role.decorator';
import { AccessTokenGuard } from 'src/common/guards/token/accessToken.guard';
import { RolesGuard } from 'src/common/guards/role/role.guard';

@Controller('')
export class SignUpController {
    constructor(private signUpService: SignUpService) {}

    @Post('sign-up')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.signUpService.signUp(signUpDto);
    }

    @Post('sign-up-tenant')
    @Roles('admin')
    signUpTenant(@Request() req, @Body() signUpDto: SignUpDto) {
        console.log('req:', req.user);
        return this.signUpService.signUpTenant(signUpDto);
    }
}
