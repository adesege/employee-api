import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { IsEmailUnique } from "validations/is-email-unique";

export class CreateEmployeeDTO {
  @ApiProperty({ example: 'Thimothy' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ example: 'Templeton' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({ example: 'thimothy@example.com' })
  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail({}, { message: 'Not a valid email address' })
  @IsEmailUnique()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be more than 6 characters' })
  password: string;
}
