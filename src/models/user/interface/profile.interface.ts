import { Document } from 'mongoose';

export interface Profile extends Document {
    readonly id: string;
    readonly user_id: string;
    readonly phone: string;
    readonly gender: string;
    readonly address: string;
    readonly age: number;
    readonly avatar: string;
    readonly name: string;

    readonly is_deleted: boolean;
}
