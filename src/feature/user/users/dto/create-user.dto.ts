import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'Domain', required: true, default: '30Shine' })
    @IsNotEmpty()
    @IsString()
    readonly domain: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;

    refreshToken?: string;
}
