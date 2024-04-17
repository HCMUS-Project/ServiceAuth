import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LoginSource } from 'src/common/enums/login.enum';

export class SignInDto {
    @ApiProperty({ description: 'Domain', required: true, default: '30Shine' })
    @IsNotEmpty()
    @IsString()
    readonly domain: string;

    @ApiProperty({ description: 'Email of the user', required: true, example: 'hcmus@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({ description: 'Password', required: true, example: '123456' })
    @IsString()
    @IsNotEmpty({ message: 'Password must not be empty' })
    readonly password: string;

    @ApiProperty({
        description: 'Device name',
        required: true,
        example: 'iPhone 15',
    })
    @IsNotEmpty()
    readonly device: string;
}
