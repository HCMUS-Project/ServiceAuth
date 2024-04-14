import { Module } from '@nestjs/common';
import { SignUpController } from './sign_up.controller';
import { SignUpService } from './sign_up.service';
import { Mongoose } from 'mongoose';
import { UserSchema } from 'src/models/user/schema/user.schema';

@Module({
    imports: [],
    controllers: [SignUpController],
    providers: [
        SignUpService,
        {
            provide: 'SIGN_UP_MODEL',
            useFactory: (mongoose: Mongoose) => mongoose.model('user', UserSchema),
            inject: ['DATABASE_CONNECTION'],
        },
    ],
})
export class SignUpModule {}
