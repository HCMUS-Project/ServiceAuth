import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';
import { ProfileUserSchema } from 'src/models/user/schema/profile.schema';
import { UserSchema } from 'src/models/user/schema/user.schema';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
    imports: [],
    controllers: [ProfileController],
    providers: [
        ProfileService,
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
    exports: [],
})
export class ProfileModule {}
