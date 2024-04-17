import * as mongoose from 'mongoose';
import { Role } from 'src/common/guards/role/role.enum';

export interface Token extends Document {
    readonly id: string;
    readonly user_id: string;
    readonly domain: string;
    readonly role: String;
    readonly device: string;
    readonly access_token: string;
    readonly refresh_token: string;
    readonly access_token_expired_at: Date;
    readonly refresh_token_expired_at: Date;
}
