import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SearchEmployeeDTO } from 'dtos/search-employee.dto';
import { SystemAdminGuard } from 'guards/system-admin.guard';
import { Model } from 'mongoose';
import { User, UserDocument } from 'schemas/user.schema';
import { EmployeeTransformer } from 'transformers/employee.transformer';

@Controller('admin/employees')
@UseGuards(SystemAdminGuard)
export class EmployeeController {

  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

  @Get()
  async search(@Query() query: SearchEmployeeDTO): Promise<EmployeeTransformer> {
    const user = await this.userModel
      .find({ $text: { $search: query.search, $caseSensitive: false } })
      .select(['firstName', 'lastName', 'email', 'id']);

    return new EmployeeTransformer(user);
  }
}
