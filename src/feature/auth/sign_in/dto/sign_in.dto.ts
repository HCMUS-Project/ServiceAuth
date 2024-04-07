import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LoginSource } from 'src/common/enums/login.enum';

export class SignInDto {
    @ApiProperty({ description: 'Email of the user', required: true, example: 'hcmus@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({
        enum: LoginSource,
        description: 'Device name',
        required: true,
        example: LoginSource.USER,
    })
    @IsEnum(LoginSource)
    @IsNotEmpty()
    readonly device: string;

    @ApiProperty({ description: 'Password', required: true, example: '123456' })
    @IsString()
    @IsNotEmpty({ message: 'Password must not be empty' })
    readonly password: string;
}
