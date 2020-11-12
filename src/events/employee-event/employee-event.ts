import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { EMPLOYEE_EVENT_TYPE, UPDATE_EMPLOYEE_EVENT } from 'events/types';
import { User } from 'schemas/user.schema';

@Injectable()
export class EmployeeEvent {
  constructor(@InjectQueue(EMPLOYEE_EVENT_TYPE) private readonly employeeQueue: Queue) { }

  updateEmployee(employee: Partial<User>): Promise<Job<any>> {
    return this.employeeQueue.add(UPDATE_EMPLOYEE_EVENT, employee, { priority: 2, removeOnComplete: true })
  }
}
