import { Inject } from '@nestjs/common';
import Logger, { LoggerKey } from 'src/core/logger/interfaces/logger.interface';
import { SignUpResponse } from 'src/proto_build/auth/sign_up_pb';
import { Model } from 'mongoose';
import { User } from 'src/models/user/interface/user.interface';
import { GrpcUnauthenticatedException } from 'nestjs-grpc-exceptions';
import * as argon from 'argon2';
import { Role } from 'src/common/enums/role.enum';

export class SignUpService {
    constructor(
        @Inject(LoggerKey) private logger: Logger,
        @Inject('SIGN_UP_MODEL') private readonly User: Model<User>,
    ) {}

    async signUp(data): Promise<SignUpResponse> {
        this.logger.debug('signUp', { props: data });

        try {
            // Check if user already exists and is active
            const checkUser = await this.User.findOne({
                email: data.email,
                domain: data.domain,
            });
            if (checkUser) throw new GrpcUnauthenticatedException('USER_ALREADY_REGISTER');

            // Save user to database
            const newUser = new this.User({
                email: data.email,
                password: await argon.hash(data.password),
                domain: data.domain,
                role: Role.USER,
            });

            await newUser.save();

            return Object.assign(new SignUpResponse(), { result: 'success' });
        } catch (error) {
            throw error;
        }
    }
}
