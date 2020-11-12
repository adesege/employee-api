import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull';
import { QueueMock } from '../../../test/mocks/queue.mock';
import { userMock } from '../../../test/mocks/user.mock';
import { EMPLOYEE_EVENT_TYPE } from '../types';
import { EmployeeEvent } from './employee-event';

describe('EmployeeEventService', () => {
  let service: EmployeeEvent;
  let queueMock: Queue;

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
    queueMock = module.get<Queue>(getQueueToken(EMPLOYEE_EVENT_TYPE));
  });

  it('should be defined', () => {
    const queueAdd = jest.fn();
    jest.spyOn(queueMock, 'add').mockImplementation(queueAdd);
    service.updateEmployee(userMock());

    expect(queueAdd).toHaveBeenCalled();
    expect(service).toBeDefined();
  });
});
