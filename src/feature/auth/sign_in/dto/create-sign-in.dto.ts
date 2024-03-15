import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateSignInDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
