import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { signUpDto } from './dto/sign_up.dto';
import * as argon from 'argon2';
import { Model } from 'mongoose';
import { User } from 'src/models/user/interfaces/user.interface';
import { validateOrReject, ValidationError } from 'class-validator';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';
import { ForbiddenException } from 'src/common/exceptions/exceptions';

@Injectable()
export class SignUpService {
    constructor(
        @Inject('SIGN_UP_MODEL') private readonly User: Model<User>,
        @Inject(LoggerKey) private logger: Logger,
    ) {}

    async signUp(_signUpDto: signUpDto): Promise<User> {
        try {
            const signUpData = Object.assign(new signUpDto(), _signUpDto);
            await validateOrReject(signUpData);
        } catch (errors) {
            if (errors instanceof Array && errors[0] instanceof ValidationError) {
                const messages = errors.map(error => Object.values(error.constraints)).join(', ');
                throw new BadRequestException(`Validation failed: ${messages}`);
            }
        }

        try {
            const hashedPassword = await argon.hash(_signUpDto.password);

            // Check if user already exists
            if (await this.User.findOne({ email: _signUpDto.email })) {
                this.logger.error("User already exists. Can't sign up!");
                throw new ForbiddenException(
                    "User already exists. Can't sign up!",
                    'User already exists',
                );
            }

            // Save user to database
            const newUser = new this.User({
                email: _signUpDto.email,
                password: hashedPassword,
            });

            const user = await newUser.save();
            return user;
        } catch (error) {
            this.logger.error('Error while signing up user', { error });
            return error;
        }
    }
}
