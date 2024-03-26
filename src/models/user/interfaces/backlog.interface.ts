import * as mongoose from 'mongoose';

export interface Backlog extends Document {
    readonly id: string; 
    readonly user_id: string;
    readonly description: mongoose.Schema.Types.Mixed;
}