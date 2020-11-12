import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AdminEmployeeController } from './employee/admin/employee.controller';
import { EmployeeController } from './employee/employee.controller';

@Module({
  controllers: [AuthController, EmployeeController, AdminEmployeeController]
})
export class ControllersModule { }
