import {User_ShortToken} from "../../interface/user_token.interface";

export interface ISignInResponse{
    statusCode: number;
    message: string;
    user_token: User_ShortToken;
}