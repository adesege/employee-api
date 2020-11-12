import { Test, TestingModule } from '@nestjs/testing';
import { AdminEmployeeController } from './employee.controller';

describe('EmployeeController', () => {
  let controller: AdminEmployeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminEmployeeController],
    }).compile();

    controller = module.get<AdminEmployeeController>(AdminEmployeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
