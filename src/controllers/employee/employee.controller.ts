import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDecorator } from 'decorators/user.decorator';
import { UpdateEmployeeDTO } from 'dtos/update-employee-dto';
import { EmployeeGuard } from 'guards/employee.guard';
import { Model } from 'mongoose';
import { User, UserDocument } from 'schemas/user.schema';
import { EmployeeTransformer } from 'transformers/employee.transformer';

@Controller('employees')
@UseGuards(EmployeeGuard)
export class EmployeeController {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  @Patch()
  async update(
    @Body() body: UpdateEmployeeDTO,
    @UserDecorator('id') userId: string,
  ): Promise<EmployeeTransformer> {
    const employee = await this.userModel.findOne({ id: userId });

    employee.phone = body.phone || employee.phone;
    employee.lastName = body.lastName || employee.lastName;
    employee.bank.accountNumber = body.accountNumber || employee.bank.accountNumber;
    await employee.save();

    return new EmployeeTransformer({ ...employee.toJSON(), ipAddresses: undefined });
  }
}
