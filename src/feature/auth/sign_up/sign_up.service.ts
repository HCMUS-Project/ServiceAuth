import {ForbiddenException, Inject, Injectable, BadRequestException} from '@nestjs/common';
import {signUpDto} from './dto/sign_up.dto';
import {ConfigService} from '@nestjs/config';
import * as argon from 'argon2';
import {Model} from 'mongoose';
import {User} from 'src/models/user/interfaces/user.interface';
import {validateOrReject, ValidationError} from 'class-validator';

@Injectable()
export class SignUpService
{
  constructor (@Inject('SIGN_UP_MODEL') private readonly User: Model<User>) { }

  async signUp (_signUpDto: signUpDto): Promise<User>
  {
    try
    {
      const signUpData = Object.assign(new signUpDto(), _signUpDto);
      await validateOrReject(signUpData);
    } catch (errors)
    {
      if (errors instanceof Array && errors[0] instanceof ValidationError)
      {
        const messages = errors.map(error => Object.values(error.constraints)).join(', ');
        throw new BadRequestException(`Validation failed: ${messages}`);
      }
    }

    try
    {
      const hashedPassword = await argon.hash(_signUpDto.password);

      const newUser = new this.User({
        email: _signUpDto.email,
        password: hashedPassword,
      });

      return await newUser.save();
    } catch (error)
    {
      if (error instanceof ForbiddenException)
      {
        console.error('User already exists. Can\'t sign up!', error);
        throw error;
      }

      console.error('An error occurred:', error);
      throw error;
    }
  }
}