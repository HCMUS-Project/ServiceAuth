import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {Backlog} from '../interfaces/backlog.interface';

export const BacklogSchema = new mongoose.Schema<Backlog>(
    {
        id: {
            type: String,
            default: () => uuidv4(),
            unique: true,
        },

        user_id: {
            type: String,
            ref: 'users',
            required: true,
        },
        
        description:{
            type: mongoose.Schema.Types.Mixed,
            required: true,
        }
    },
    { timestamps: true },
);