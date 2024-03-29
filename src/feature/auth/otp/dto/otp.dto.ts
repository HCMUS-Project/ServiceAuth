import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class OtpDto {
    @ApiProperty({ description: 'Email of the user', required: true, example: 'hcmus@gmail.com' })
    @IsString()
    @IsNotEmpty({ message: 'Email must not be empty' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ description: 'OTP code', required: true, example: '123456' })
    @IsString()
    @IsNotEmpty({ message: 'OTP must not be empty' })
    otp: string;
}
