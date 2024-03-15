import * as mongoose from 'mongoose';

export const signUpSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
});