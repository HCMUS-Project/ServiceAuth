import { Document } from 'mongoose';

export interface User extends Document {
    readonly username: string,
    readonly password: string, 
    readonly is_deleted: boolean,
    readonly is_active: boolean,
}
