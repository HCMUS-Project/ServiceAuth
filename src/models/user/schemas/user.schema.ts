import * as mongoose from 'mongoose';
import { User as UserInterface } from '../interfaces/user.interface';

export const UserSchema = new mongoose.Schema<UserInterface>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);
