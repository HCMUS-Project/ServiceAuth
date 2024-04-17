import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
    @ApiProperty({ description: 'Email of the user', required: true, default: 'hcmus@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({ description: 'Password', required: true, default: '123456' })
    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({ description: 'Domain', required: true, default: '30Shine' })
    @IsNotEmpty()
    @IsString()
    readonly domain: string;

    @ApiProperty({ description: 'Device name', required: true, default: 'iPhone 15' })
    @IsNotEmpty()
    @IsString()
    readonly device: string;

    @IsString()
    @IsNotEmpty()
    readonly user_name: string;

    @IsString()
    @IsNotEmpty()
    readonly phone_number: string;
}
