import { getQueueToken } from '@nestjs/bull';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { configureApp } from 'configure-app';
import { EmployeeEvent } from 'events/employee-event/employee-event';
import { EMPLOYEE_EVENT_TYPE } from 'events/types';
import faker from 'faker';
import { IpAddressDocument } from 'schemas/ip-address.schema';
import { User, UserDocument, UserSchema } from 'schemas/user.schema';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { QueueMock } from './mocks/queue.mock';
import { userMock } from './mocks/user.mock';
import { cleanupDocuments } from './utils/cleanup-document';
import { createIpAddress } from './utils/ip-address';
import { createUser, signToken } from './utils/user';

describe('Employee (e2e)', () => {
  let app: NestExpressApplication;
  let employee: UserDocument;
  let employeeToken: string;
  let employeeIpAddress: IpAddressDocument;

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
    employeeIpAddress = await createIpAddress(app, { user: employee._id, address: faker.internet.ip() });
    employeeToken = await signToken(app, employee);

    const employeeEvent = app.get<EmployeeEvent>(EmployeeEvent);
    jest.spyOn(employeeEvent, 'updateEmployee').mockImplementation(updateEmployeeHandler);
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
      .set({ Authorization: `Bearer ${employeeToken}`, 'X-Forwarded-For': employeeIpAddress.address })
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
      .set({ Authorization: `Bearer ${employeeToken}`, 'X-Forwarded-For': employeeIpAddress.address })
      .accept('application/json')
      .expect(200)
      .expect(response => {
        expect(response.body.lastName).toEqual(lastName)
        expect(updateEmployeeHandler).toHaveBeenCalled();
      });
  });

  it('should not allow an employee update his/her details if the wrong ip address is provided', () => {
    const lastName = userMock().lastName;
    const phone = userMock().phone;

    return request(app.getHttpServer())
      .patch('/api/employees')
      .send({ lastName, phone })
      .set({ Authorization: `Bearer ${employeeToken}`, 'X-Forwarded-For': faker.internet.ip() })
      .accept('application/json')
      .expect(403)
  });

});
