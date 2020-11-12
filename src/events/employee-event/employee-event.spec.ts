import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeEvent } from './employee-event';

describe('EmployeeEventService', () => {
  let service: EmployeeEvent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeEvent],
    }).compile();

    service = module.get<EmployeeEvent>(EmployeeEvent);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
