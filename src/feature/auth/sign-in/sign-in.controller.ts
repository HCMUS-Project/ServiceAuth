import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SignInService } from './sign-in.service';
import { CreateSignInDto } from './dto/create-sign-in.dto';
import { UpdateSignInDto } from './dto/update-sign-in.dto';

@Controller('auth/signin')
export class SignInController {
  constructor(private readonly signInService: SignInService) {}

  @Post()
  async signIn(@Body() createSignInDto: CreateSignInDto) {
    return await this.signInService.signIn(createSignInDto);
  }
}
