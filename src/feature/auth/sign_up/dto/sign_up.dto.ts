import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LoginSource } from 'src/common/enums/login.enum';

export class SignUpDto {
    @ApiProperty({ description: 'Email of the user', required: true, default: 'hcmus@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({ enum: LoginSource, description: 'Device name', required: true, default: 'USER' })
    @IsEnum(LoginSource)
    @IsNotEmpty()
    readonly loginSource: LoginSource;

    @ApiProperty({ description: 'Password', required: true, default: '123456' })
    @IsString()
    @IsNotEmpty()
    readonly password: string;
}
