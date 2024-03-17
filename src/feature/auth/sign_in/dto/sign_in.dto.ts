import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class signInDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
