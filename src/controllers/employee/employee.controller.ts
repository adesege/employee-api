import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateEmployeeDTO } from 'dtos/create-employee.dto';
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

  @Post()
  async create(@Body() body: CreateEmployeeDTO): Promise<Record<string, string>> {

    await this.userModel.create({ ...body, email: body.email.toLowerCase() });

    return { message: 'Employee created successfully' };
  }

}
