import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateEmployeeDTO } from 'dtos/create-employee.dto';
import { SearchEmployeeDTO } from 'dtos/search-employee.dto';
import { UpdateEmployeeDTO } from 'dtos/update-employee.dto';
import { SystemAdminGuard } from 'guards/system-admin.guard';
import { Model } from 'mongoose';
import { IpAddress, IpAddressDocument } from 'schemas/ip-address.schema';
import { User, UserDocument } from 'schemas/user.schema';
import { IpAddressService } from 'services/ip-address/ip-address.service';
import { EmployeeTransformer } from 'transformers/employee.transformer';

@Controller('admin/employees')
@UseGuards(SystemAdminGuard)
export class EmployeeController {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(IpAddress.name) private readonly ipAddressModel: Model<IpAddressDocument>,
    private readonly ipAddressService: IpAddressService
  ) { }

  @Get()
  async search(@Query() query: SearchEmployeeDTO): Promise<EmployeeTransformer> {
    const employees = await this.userModel
      .find({ $text: { $search: query.search, $caseSensitive: false } })
      .select(['firstName', 'lastName', 'email', 'id']);

    const newEmployees = await Promise.all(
      employees.map(async employee => ({
        ...employee.toJSON(),
        ipAddresses: await this.ipAddressModel.find({ user: employee._id })
      }))
    )

    return new EmployeeTransformer(newEmployees);
  }

  @Post()
  async create(@Body() body: CreateEmployeeDTO): Promise<Record<string, string>> {

    await this.userModel.create({ ...body, email: body.email.toLowerCase() });

    return { message: 'Employee created successfully' };
  }

  @Patch(':employeeId')
  async update(
    @Body() body: UpdateEmployeeDTO,
    @Param('employeeId') employeeId: string
  ): Promise<EmployeeTransformer> {
    const employee = await this.userModel.findOne({ id: employeeId });
    if (!employee) {
      throw new NotFoundException('Employee not found. Update action failed');
    }
    let ipAddresses: IpAddress;

    if (body.ipAddress) {
      ipAddresses = await this.ipAddressService.updateOrCreate(
        { user: employee._id, address: body.ipAddress },
        { address: body.ipAddress, user: employee._id },
      );
    }

    employee.status = body.status || employee.status;
    employee.save();

    return new EmployeeTransformer({ ...employee.toJSON(), ipAddresses });
  }
}
