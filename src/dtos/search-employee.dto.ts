import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SearchEmployeeDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Search query is required' })
  search: string;
}
