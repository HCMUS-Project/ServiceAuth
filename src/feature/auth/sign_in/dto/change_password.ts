import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ description: 'Domain', required: true, default: '30Shine' })
    @IsNotEmpty()
    @IsString()
    readonly domain: string;

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
