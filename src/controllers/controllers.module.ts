import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { EmployeeController } from './employee/employee.controller';

@Module({
  controllers: [AuthController, EmployeeController]
})
export class ControllersModule { }
