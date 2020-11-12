import { IsAlphanumeric, IsMobilePhone, IsNumber, IsOptional } from "class-validator";

export class UpdateEmployeeDTO {
  @IsOptional()
  @IsNumber()
  accountNumber: number;

  @IsOptional()
  @IsAlphanumeric()
  lastName: string;

  @IsOptional()
  @IsMobilePhone('en-NG', { strictMode: true },
    {
      message: 'Not a valid phone number. \
    Ensure the country code is supplied or it\'s in format +2348*********'
    }
  )
  phone: string;

}
