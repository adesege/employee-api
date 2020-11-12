import { IsNotEmpty } from "class-validator";

export class SearchEmployeeDTO {
  @IsNotEmpty({ message: 'Search query is required' })
  search: string;
}
