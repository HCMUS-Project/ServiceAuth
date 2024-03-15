import { Mongoose } from 'mongoose';
import {signUpSchema} from './schemas/sign_up.schema';

export const signUpProviders = [
  {
    provide: 'SIGN_UP_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('signUp', signUpSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];