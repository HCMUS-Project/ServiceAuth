import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Mongoose } from 'mongoose';
import { UserSchema } from 'src/models/user/schema/user.schema';
import { Jwt } from 'src/util/jwt/jwt';
import { SignInController } from './sign_in.controller';
import { SignInService } from './sign_in.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
            }),
        }),
    ],
    controllers: [SignInController],
    providers: [
        Jwt,
        SignInService,
        {
            provide: 'USER_MODEL',
            useFactory: (mongoose: Mongoose) => mongoose.model('user', UserSchema),
            inject: ['DATABASE_CONNECTION'],
        },
    ],
})
export class SignInModule {}
