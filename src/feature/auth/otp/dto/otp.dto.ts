import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class OtpDto {
    @ApiProperty({ description: 'Domain', required: true, default: '30Shine' })
    @IsNotEmpty()
    @IsString()
    readonly domain: string;

    @ApiProperty({ description: 'Email of the user', required: true, example: 'hcmus@gmail.com' })
    @IsString()
    @IsNotEmpty({ message: 'Email must not be empty' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ description: 'OTP code', required: true, example: '123456' })
    @IsString()
    @IsOptional()
    otp: string;
}
