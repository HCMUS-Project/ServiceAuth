import { Document } from 'mongoose';

export interface TenantProfile extends Document {
    readonly username: string;
    readonly email: string;
    readonly phone: string;
    readonly gender: string;
    readonly address: string;
    readonly age: number;
    readonly avatar: string;
    readonly name: string;
    readonly stage: string;
    readonly domain: string;

    readonly is_verify: boolean;
    readonly createAt: Date;
}
