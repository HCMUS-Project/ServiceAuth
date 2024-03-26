import { Mongoose } from 'mongoose';
import { UserSchema } from '../../../models/user/schemas/user.schema';
import {BacklogSchema} from 'src/models/user/schemas/backlog.schema';

export const signInProviders = [
    {
        provide: 'USER_MODEL',
        useFactory: (mongoose: Mongoose) => mongoose.model('user', UserSchema),
        inject: ['DATABASE_CONNECTION'],
    },
    {
        provide: 'BACKLOG_MODEL',
        useFactory: (mongoose: Mongoose) => mongoose.model('backlog', BacklogSchema),
        inject: ['DATABASE_CONNECTION'],
    }
];
