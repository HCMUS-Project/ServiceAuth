import { UnauthorizedException, Injectable, Inject, BadRequestException } from '@nestjs/common';
import { signInDto } from './dto/sign_in.dto';
import { User } from 'src/models/user/interfaces/user.interface';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import {validateOrReject, ValidationError} from 'class-validator';

@Injectable()
export class SignInService {
  constructor(@Inject('USER_MODEL') private readonly User: Model<User>) {}

  async signIn(_signInDto: signInDto): Promise<any> {

    try
    {
      const signInData = Object.assign(new signInDto(), _signInDto);
      await validateOrReject(signInData);
    } catch (errors)
    {
      if (errors instanceof Array && errors[0] instanceof ValidationError)
      {
        const messages = errors.map(error => Object.values(error.constraints)).join(', ');
        throw new BadRequestException(`Validation failed: ${messages}`);
      }
    }

    const user = await this.User.findOne({ email: _signInDto.email }).select('+password');

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordMatch = await argon.verify(user.password, _signInDto.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return { message: 'Login successful' };
  }
}