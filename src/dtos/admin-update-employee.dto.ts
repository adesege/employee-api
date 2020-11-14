import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsIP, IsOptional } from "class-validator";
import { StatusEnum } from "enums/status.enum";

export class AdminUpdateEmployeeDTO {
  @ApiProperty({ example: '127.0.0.1', required: false })
  @IsOptional()
  @IsIP('4', { message: 'Not a valid ip4 address' })
  ipAddress: string;

  @ApiProperty({ enum: StatusEnum, example: StatusEnum.ACTIVATED, required: false })
  @IsOptional()
  @IsEnum(StatusEnum, { message: `Status must be one of ${Object.values(StatusEnum).join(', ')}` })
  status: StatusEnum;
}
