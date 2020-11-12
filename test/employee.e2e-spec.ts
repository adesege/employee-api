import { getQueueToken } from '@nestjs/bull';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { configureApp } from 'configure-app';
import { EmployeeEvent } from 'events/employee-event/employee-event';
import { EMPLOYEE_EVENT_TYPE } from 'events/types';
import { User, UserDocument, UserSchema } from 'schemas/user.schema';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { QueueMock } from './mocks/queue.mock';
import { userMock } from './mocks/user.mock';
import { cleanupDocuments } from './utils/cleanup-document';
import { createUser, signToken } from './utils/user';

describe('Employee (e2e)', () => {
  let app: INestApplication;
  let employee: UserDocument;
  let employeeToken: string;

  const userAsEmployee = userMock();
  const updateEmployeeHandler = jest.fn();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [EmployeeEvent,
        {
          provide: getQueueToken(User.name),
          useValue: UserSchema
        },
        {
          provide: getQueueToken(EMPLOYEE_EVENT_TYPE),
          useClass: QueueMock
        }
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    employee = await createUser(app, userAsEmployee) as UserDocument;
    employeeToken = await signToken(app, employee);

    const employeeEvent = app.get<EmployeeEvent>(EmployeeEvent);
    jest.spyOn(employeeEvent, 'updateEmployee').mockImplementationOnce(updateEmployeeHandler);

  });

  afterAll(async () => {
    await cleanupDocuments(app);
    await app.close();
  });

  it('should allow an employee update his/her bank account number', () => {
    const accountNumber = userMock().bank.accountNumber;

    return request(app.getHttpServer())
      .patch('/api/employees')
      .send({ accountNumber })
      .set({ Authorization: `Bearer ${employeeToken}` })
      .accept('application/json')
      .expect(200)
      .expect(response => {
        expect(response.body.bank.accountNumber).toEqual(accountNumber)
        expect(updateEmployeeHandler).toHaveBeenCalled();
      });
  });

  it('should allow an employee update his/her lastName and phone number', () => {
    const lastName = userMock().lastName;
    const phone = userMock().phone;

    return request(app.getHttpServer())
      .patch('/api/employees')
      .send({ lastName, phone })
      .set({ Authorization: `Bearer ${employeeToken}` })
      .accept('application/json')
      .expect(200)
      .expect(response => {
        expect(response.body.lastName).toEqual(lastName)
        expect(updateEmployeeHandler).toHaveBeenCalled();
      });
  });

});
