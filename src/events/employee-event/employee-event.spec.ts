import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { QueueMock } from '../../../test/mocks/queue.mock';
import { userMock } from '../../../test/mocks/user.mock';
import { EMPLOYEE_EVENT_TYPE } from '../types';
import { EmployeeEvent } from './employee-event';

describe('EmployeeEventService', () => {
  let service: EmployeeEvent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeEvent,
        {
          provide: getQueueToken(EMPLOYEE_EVENT_TYPE),
          useClass: QueueMock
        }
      ],
    }).compile();

    service = module.get<EmployeeEvent>(EmployeeEvent);
  });

  it('should be defined', () => {
    const updateEmployee = jest.fn();
    jest.spyOn(service, 'updateEmployee').mockImplementation(updateEmployee);
    service.updateEmployee(userMock());

    expect(updateEmployee).toHaveBeenCalled();
    expect(service).toBeDefined();
  });
});
