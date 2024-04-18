import * as mongoose from 'mongoose';
import { User as UserInterface } from '../interface/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { Role } from 'src/proto_build/auth/user_token_pb';

export const UserSchema = new mongoose.Schema<UserInterface>(
    {
        email: {
            type: String,
            required: true,
            // unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: Number,
            required: true,
            enum: Object.values(Role),
        },
        domain: {
            type: String,
            required: true,
            // unique: true,
        },
        user_id: {
            type: String,
            default: () => uuidv4(),
            unique: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
        is_active: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

UserSchema.index({ email: 1, domain: 1 }, { unique: true });
