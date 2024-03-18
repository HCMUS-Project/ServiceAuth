import { Injectable, Inject } from '@nestjs/common';
import { signInDto } from './dto/sign_in.dto';
import { User } from 'src/models/user/interfaces/user.interface';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { validateOrReject, ValidationError } from 'class-validator';
import {JwtModule, JwtService} from "@nestjs/jwt";
import * as uuid from 'uuid';
import {
    UserNotFoundException,
    InvalidPasswordException,
    ValidationFailedException,
}
from '../../../common/exceptions/exceptions';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';

@Injectable()
export class SignInService {

    constructor(
        @Inject('USER_MODEL') private readonly User: Model<User>,
        @Inject(LoggerKey) private logger: Logger,
        private jwtService: JwtService
    ) {}

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

        try{
            const user = await this.User.findOne({ email: _signInDto.email }).select('+password');

            if (!user) {
                throw new UserNotFoundException('User not found for email: ' + _signInDto.email);
            }

            const isPasswordMatch = await argon.verify(user.password, _signInDto.password);

            if (!isPasswordMatch) {
                throw new InvalidPasswordException('Invalid password for user: ' + user.email);
            }
            const signToken = this.signToken(user.id, user.email);
            return { message: 'Login successful',access_token: signToken };
        } catch (error) {
            this.logger.error('Error while signing in user', { error });
            return error;
        }
    }

    signToken(id: string, email: string) {
        const payload = { id, email };
        const jwtSecret = process.env.JWT_SECRET || uuid.v4();
        return this.jwtService.sign(payload,{
            expiresIn: '180m',
            secret: jwtSecret
        });
    }
}
