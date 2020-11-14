import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsMobilePhone, IsNumber, IsOptional } from "class-validator";

export class UpdateEmployeeDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  accountNumber: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsAlphanumeric()
  lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMobilePhone('en-NG', { strictMode: true },
    {
      message: 'Not a valid phone number. \
    Ensure the country code is supplied or it\'s in format +2348*********'
    }
  )
  phone: string;

}
