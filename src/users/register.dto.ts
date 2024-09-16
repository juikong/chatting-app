import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  displayname: string;

  @IsString()
  departmentname: string;

  @IsString()
  division: string;

  @IsString()
  location: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  photo: string;
}
