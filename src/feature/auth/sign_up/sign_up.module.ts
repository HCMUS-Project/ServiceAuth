import { Module } from '@nestjs/common';
import { SignUpController } from './sign_up.controller';
import { SignUpService } from './sign_up.service';
import { Mongoose } from 'mongoose';
import { UserSchema } from 'src/models/user/schema/user.schema';
import { NodeMailerModule } from 'src/util/node_mailer/node_mailer.module';
import { ProfileUserSchema } from 'src/models/user/schema/profile.schema';

@Module({
    imports: [NodeMailerModule],
    controllers: [SignUpController],
    providers: [
        SignUpService,
        {
            provide: 'USER_MODEL',
            useFactory: (mongoose: Mongoose) => mongoose.model('user', UserSchema),
            inject: ['DATABASE_CONNECTION'],
        },
        {
            provide: 'PROFILE_MODEL',
            useFactory: (mongoose: Mongoose) => mongoose.model('profile', ProfileUserSchema),
            inject: ['DATABASE_CONNECTION'],
        },
    ],
})
export class SignUpModule {}
