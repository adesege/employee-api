import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { EmployeeEvent } from './employee-event/employee-event';
import { EMPLOYEE_EVENT_TYPE } from './types';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: EMPLOYEE_EVENT_TYPE,
    })
  ],
  providers: [EmployeeEvent],
  exports: [EmployeeEvent],
})
export class EventsModule { }
