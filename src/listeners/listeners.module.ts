import { Global, Module } from '@nestjs/common';
import { EmployeeListener } from './employee.listener';

@Global()
@Module({
  providers: [EmployeeListener],
  exports: [EmployeeListener]
})
export class ListenersModule { }
