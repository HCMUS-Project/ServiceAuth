import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly oldPassword: string;

    @IsString()
    @IsNotEmpty()
    readonly newPassword: string;
}
