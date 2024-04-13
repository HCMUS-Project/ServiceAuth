import * as mongoose from 'mongoose';

export interface ShortToken {
    access_token: string;
    refresh_token: string;
    access_token_expired_at: string;
    refresh_token_expired_at: string;
}
