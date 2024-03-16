import {  Inject, Injectable } from '@nestjs/common';
import { signInDto } from './dto/sign_in.dto';
import { User } from 'src/models/user/interfaces/user.interface';
import * as argon from 'argon2';
import { Model } from 'mongoose';

@Injectable()
export class SignInService {
  constructor(@Inject('USER_MODEL') private readonly User: Model<User>) {
  }

  async signIn(signInDto: signInDto): Promise<any> {
    try {
      const user = await this.User.findOne({email: signInDto.email}).select('+password')

      if (!user) {
        return {message: 'User not found'};
      }

      const isPasswordMatch = await argon.verify(user.password, signInDto.password);
      if (!isPasswordMatch) {
        return {message: 'Invalid password'};
      }

      return {message: 'Login successful'};
    } catch (error) {
      return {message: error.message};
    }
  }
}