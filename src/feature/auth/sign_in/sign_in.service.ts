import { Injectable } from '@nestjs/common';
import { CreateSignInDto } from './dto/create-sign-in.dto';
import { UpdateSignInDto } from './dto/update-sign-in.dto';
import { Model } from 'mongoose';
import { User } from "../../../models/user/schemas/user.schema";
import { compare } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class Sign_inService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}
  async signIn(createSignInDto: CreateSignInDto): Promise<any> {
    const user = await this.userModel.findOne({ email: createSignInDto.email }).select('+password');

    if (!user) {
      return { message: 'User not found' };
    }
    const isPasswordMatch = await compare(createSignInDto.password, user.password);
    if (!isPasswordMatch) {
      return { message: 'Invalid password' };
    }

    return { message: 'Login succesful' };
  }
}
