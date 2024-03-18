import { Injectable, Inject } from '@nestjs/common';
import { signInDto } from './dto/sign_in.dto';
import { User } from 'src/models/user/interfaces/user.interface';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { validateOrReject, ValidationError } from 'class-validator';
import { UserNotFoundException, InvalidPasswordException, ValidationFailedException } from '../../../common/exceptions/exceptions';

@Injectable()
export class SignInService {
    constructor(@Inject('USER_MODEL') private readonly User: Model<User>) {}

    async signIn(_signInDto: signInDto): Promise<any> {
        try {
            const signInData = Object.assign(new signInDto(), _signInDto);
            await validateOrReject(signInData);
        } catch (errors) {
            if (errors instanceof Array && errors[0] instanceof ValidationError) {
                const messages = errors.map(error => Object.values(error.constraints)).join(', ');
                throw new ValidationFailedException(`Validation failed: ${messages}`);
            } else {
                throw new ValidationFailedException('Validation failed', errors.toString());
            }
        }

        const user = await this.User.findOne({ email: _signInDto.email }).select('+password');

        if (!user) {
            throw new UserNotFoundException('User not found for email: ' + _signInDto.email);
        }

        const isPasswordMatch = await argon.verify(user.password, _signInDto.password);

        if (!isPasswordMatch) {
            throw new InvalidPasswordException('Invalid password for user: ' + user.email);
        }

        return { message: 'Login successful' };
    }
}
