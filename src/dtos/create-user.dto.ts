import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { IsEmailUnique } from "validations/is-email-unique";

export class CreateUserDTO {
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail({}, { message: 'Not a valid email address' })
  @IsEmailUnique()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be more than 6 characters' })
  password: string;
}
