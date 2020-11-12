import { IsEnum, IsIP, IsOptional } from "class-validator";
import { StatusEnum } from "enums/status.enum";

export class AdminUpdateEmployeeDTO {
  @IsOptional()
  @IsIP('4', { message: 'Not a valid ip4 address' })
  ipAddress: string;

  @IsOptional()
  @IsEnum(StatusEnum, { message: `Status must be one of ${Object.values(StatusEnum).join(', ')}` })
  status: StatusEnum;
}
