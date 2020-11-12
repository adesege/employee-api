import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { IsEmailExist } from "validations/is-email-exist";

export class SigninDTO {
  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail({}, { message: 'Not a valid email address' })
  @IsEmailExist()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be more than 6 characters' })
  password: string;
}
