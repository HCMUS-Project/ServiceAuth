import {ForbiddenException, Inject, Injectable} from '@nestjs/common';
import {signUpDto} from './dto/sign_up.dto';
import {ConfigService} from '@nestjs/config';
import * as argon from 'argon2';
import {Model} from 'mongoose';
import {User} from 'src/models/user/interfaces/user.interface';
import {LoggerModule} from 'src/core/logger/modules/logger.module';
import Logger, {LoggerKey} from 'src/core/logger/interfaces/logger.interface';

@Injectable()
export class SignUpService
{
  constructor (@Inject('SIGN_UP_MODEL') private readonly User: Model<User>) { }

  async signUp (signUpDto: signUpDto): Promise<User>
  {
    const hash = await argon.hash(signUpDto.password);

    try
    {
      const newUser = {
        ...signUpDto,
        password: hash,
      };

      console.log(signUpDto);
      let createdUser = await this.User.create(newUser);

      return createdUser;
    }
    catch (error)
    {
      if (error.code === 11000)
      {
        throw new ForbiddenException('User already exists. Can\'t sign up!');
      } else
      {
        console.error('An error occurred:', error);
      }
      throw error;
    }
  }
}
