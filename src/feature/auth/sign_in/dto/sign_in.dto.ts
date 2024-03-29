import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
    @ApiProperty({ description: 'Email of the user', required: true, default: 'hcmus@gmail.com' })
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email must not be empty' })
    readonly email: string;

    @ApiProperty({ description: 'Device name', required: true, default: 'iPhone 15' })
    @IsString()
    @IsNotEmpty({ message: 'Device must not be empty' })
    readonly device: string;

    @ApiProperty({ description: 'Password', required: true, default: '123456' })
    @IsString()
    @IsNotEmpty({ message: 'Password must not be empty' })
    readonly password: string;
}
