import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from 'decorators/user.decorator';
import { UpdateEmployeeDTO } from 'dtos/update-employee-dto';
import { EmployeeEvent } from 'events/employee-event/employee-event';
import { EmployeeGuard } from 'guards/employee.guard';
import { Model } from 'mongoose';
import { User, UserDocument } from 'schemas/user.schema';
import { EmployeeTransformer } from 'transformers/employee.transformer';

@ApiTags('Employees')
@ApiBearerAuth()
@Controller('employees')
@UseGuards(EmployeeGuard)
export class EmployeeController {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly employeeEvent: EmployeeEvent
  ) { }

  @ApiHeader({
    name: 'X-Forwarded-For',
    description: 'Ip Address',
  })
  @Patch()
  async update(
    @Body() body: UpdateEmployeeDTO,
    @UserDecorator('id') userId: string,
  ): Promise<EmployeeTransformer> {
    const employee = await this.userModel.findOne({ id: userId });

    employee.phone = body.phone || employee.phone;
    employee.lastName = body.lastName || employee.lastName;
    employee.bank.accountNumber = body.accountNumber || employee.bank.accountNumber;

    if (employee.isModified()) {
      await this.employeeEvent.updateEmployee(employee);
    }

    await employee.save();

    return new EmployeeTransformer({ ...employee.toJSON(), ipAddresses: undefined });
  }
}
