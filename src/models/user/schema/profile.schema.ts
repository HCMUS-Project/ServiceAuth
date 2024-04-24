import * as mongoose from 'mongoose';
import { Profile as ProfileInterface } from '../interface/profile.interface';
import { v4 as uuidv4 } from 'uuid';

export const ProfileUserSchema = new mongoose.Schema<ProfileInterface>(
    {
        id: {
            type: String,
            default: () => uuidv4(),
            unique: true,
        },
        user_id: {
            type: String,
            ref: 'User',
        },
        phone: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: false,
        },
        age: {
            type: Number,
            required: false,
        },
        avatar: {
            type: String,
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);
