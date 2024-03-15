import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Sign_inService } from './sign_in.service';
import { CreateSignInDto } from './dto/create-sign-in.dto';
import { UpdateSignInDto } from './dto/update-sign-in.dto';

@Controller('auth/signin')
export class Sign_inController {
  constructor(private readonly signInService: Sign_inService) {}

  @Post()
  async signIn(@Body() createSignInDto: CreateSignInDto) {
    return await this.signInService.signIn(createSignInDto);
  }
}
