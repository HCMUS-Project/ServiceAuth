import {Inject, Injectable} from '@nestjs/common';
import {signUpDto} from './dto/sign_up.dto';
import {ConfigService} from '@nestjs/config';
import * as argon from 'argon2';
import {Model} from 'mongoose';
import { signUp } from './interfaces/sign_up.interface';

@Injectable()
export class SignUpService
{
  constructor(@Inject('SIGN_UP_MODEL') private signUpModel: Model<signUp>) {}

  async signUp(signUpDto: signUpDto): Promise<signUp> {
    const hash = await argon.hash(signUpDto.password)

    const newUser = {
      ...signUpDto,
      password: hash,
    };
    let createdUser = await this.signUpModel.create(newUser);

    return createdUser;
  }
}
