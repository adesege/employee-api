import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { configureApp } from 'configure-app';
import { RolesEnum } from 'enums/roles.enum';
import merge from 'lodash.merge';
import { UserDocument } from 'schemas/user.schema';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { userMock } from './mocks/user.mock';
import { cleanupDocuments } from './utils/cleanup-document';
import { createUser, signToken } from './utils/user';

describe('AdminEmployee (e2e)', () => {
  let app: INestApplication;
  let systemAdmin: UserDocument;
  let employee: UserDocument;
  let employeeToken: string;
  let systemAdminToken: string;

  const userAsSystemAdmin = merge(userMock(), { roles: [RolesEnum.SYSTEM_ADMIN] });
  const userAsEmployee = userMock();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    systemAdmin = await createUser(app, userAsSystemAdmin);
    employee = await createUser(app, userAsEmployee);
    employeeToken = await signToken(app, employee);
    systemAdminToken = await signToken(app, systemAdmin);
  });

  afterAll(async () => {
    await cleanupDocuments(app);
    await app.close();
  });

  it('should log a system admin in', () => {
    return request(app.getHttpServer())
      .post('/api/auth/signin')
      .send({ email: userAsSystemAdmin.email, password: userAsSystemAdmin.password })
      .accept('application/json')
      .expect(200)
      .expect(response => {
        expect(response.body).toHaveProperty('token')
        expect(response.body.user.roles).toContain('system_admin');
      });
  });

  it('should not allow an employee create another employee', async () => {
    const newUserAsEmployee = userMock();

    return request(app.getHttpServer())
      .post('/api/admin/employees')
      .set({ Authorization: `Bearer ${employeeToken}` })
      .send({
        email: newUserAsEmployee.email,
        password: newUserAsEmployee.password,
        firstName: newUserAsEmployee.firstName,
        lastName: newUserAsEmployee.lastName,
      })
      .accept('application/json')
      .expect(403)
  });

  describe('Create Employee', () => {
    const newUserAsEmployee = userMock();

    it('should create an employee', async () => {
      return request(app.getHttpServer())
        .post('/api/admin/employees')
        .set({ Authorization: `Bearer ${systemAdminToken}` })
        .send({
          email: newUserAsEmployee.email,
          password: newUserAsEmployee.password,
          firstName: newUserAsEmployee.firstName,
          lastName: newUserAsEmployee.lastName,
        })
        .accept('application/json')
        .expect(200)
        .expect(response => {
          expect(response.body.firstName).toEqual(newUserAsEmployee.firstName);
          expect(response.body.lastName).toEqual(newUserAsEmployee.lastName);
          expect(response.body.email).toEqual(newUserAsEmployee.email);
          expect(response.body).not.toHaveProperty('password');
        })
    });

    it('should not create an employee with the same email address', async () => {
      return request(app.getHttpServer())
        .post('/api/admin/employees')
        .set({ Authorization: `Bearer ${systemAdminToken}` })
        .send({
          ...userMock(),
          email: newUserAsEmployee.email,
        })
        .accept('application/json')
        .expect(400)
        .expect(response => {
          expect(response.body.message).toContain("An employee with this email address already exist")
        })
    });

    it('should not create an employee if no payload is specified', async () => {
      return request(app.getHttpServer())
        .post('/api/admin/employees')
        .set({ Authorization: `Bearer ${systemAdminToken}` })
        .send()
        .accept('application/json')
        .expect(400)
        .expect(response => {
          expect(response.body.message).toEqual(expect.arrayContaining([
            "First name is required",
            "Last name is required",
            "Not a valid email address",
            "Email address is required",
            "Password must be more than 6 characters",
            "Password is required"
          ]))
        })
    });
  })

});
