import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { configureApp } from 'configure-app';
import { RolesEnum } from 'enums/roles.enum';
import { StatusEnum } from 'enums/status.enum';
import faker from 'faker';
import { IpAddressDocument } from 'schemas/ip-address.schema';
import { UserDocument } from 'schemas/user.schema';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { userMock } from './mocks/user.mock';
import { cleanupDocuments } from './utils/cleanup-document';
import { createIpAddress } from './utils/ip-address';
import { createUser, signToken } from './utils/user';

describe('AuthController (e2e)', () => {
  let app: NestExpressApplication;
  let deactivatedUserToken: string;
  let userDocument: UserDocument;
  let userToken: string;
  let tokenWithoutUserPayload: string;
  let userIpAddress: IpAddressDocument;
  const user = userMock();
  const deactivatedUser = userMock();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    userDocument = await createUser(app, user) as UserDocument;
    const deactivatedUserDocument = await createUser(app, {
      ...deactivatedUser,
      status: StatusEnum.DEACTIVATED
    }) as UserDocument;
    deactivatedUserToken = await signToken(app, deactivatedUserDocument);
    userToken = await signToken(app, userDocument);
    tokenWithoutUserPayload = await signToken(app, {});

    userIpAddress = await createIpAddress(app, { user: userDocument._id, address: faker.internet.ip() });

  });

  afterAll(async () => {
    await cleanupDocuments(app);
    await app.close();
  });

  it('should log an employee in', () => {
    return request(app.getHttpServer())
      .post('/api/auth/signin')
      .send({ email: user.email, password: user.password })
      .accept('application/json')
      .expect(200)
      .expect(response => {
        expect(response.body).toHaveProperty('token')
        expect(response.body.user.roles).toHaveLength(1);
        expect(response.body.user.roles).toContain(RolesEnum.EMPLOYEE);
        expect(user).toEqual(expect.objectContaining(response.body.user));
      });
  });

  it('should get authenticated user payload', () => {
    return request(app.getHttpServer())
      .get('/api/auth/me')
      .set({ Authorization: `Bearer ${userToken}`, 'X-Forwarded-For': userIpAddress.address })
      .accept('application/json')
      .expect(200)
      .expect(response => {
        expect(response.body.firstName).toEqual(user.firstName)
        expect(response.body.lastName).toEqual(user.lastName)
        expect(response.body.email).toEqual(user.email)
      });
  });

  it('should not allow a user to login if the user payload is empty', () => {
    return request(app.getHttpServer())
      .get('/api/auth/me')
      .set({ Authorization: `Bearer ${tokenWithoutUserPayload}`, 'X-Forwarded-For': userIpAddress.address })
      .accept('application/json')
      .expect(401)
  });

  it('should not allow employee to perform action if employee is not authenticated using localhost ip', () => {
    return request(app.getHttpServer())
      .get('/api/auth/me')
      .set({ Authorization: `Bearer ${userToken}`, 'X-Forwarded-For': '' })
      .accept('application/json')
      .expect(403)
  });

  it('should not log an employee in if password is incorrect', () => {
    return request(app.getHttpServer())
      .post('/api/auth/signin')
      .send({ email: user.email, password: userMock().password })
      .accept('application/json')
      .expect(401)
      .expect(response => {
        expect(response.body.message).toEqual('Username or password is incorrect')
      });
  });

  it('should not log an employee in if email is not a valid email address', () => {
    return request(app.getHttpServer())
      .post('/api/auth/signin')
      .send({ email: 'invalid@test', password: user.password })
      .accept('application/json')
      .expect(400)
      .expect(response => {
        expect(response.body.message).toContain("Not a valid email address")
      });
  });

  it('should not log an employee in if email is empty', () => {
    return request(app.getHttpServer())
      .post('/api/auth/signin')
      .send({ email: '', password: user.password })
      .accept('application/json')
      .expect(400)
      .expect(response => {
        expect(response.body.message).not.toContain("Email address does not exist")
      });
  });

  it('should not log a deactivated employee in', () => {
    return request(app.getHttpServer())
      .post('/api/auth/signin')
      .send({ email: deactivatedUser.email, password: deactivatedUser.password })
      .accept('application/json')
      .expect(401)
  });

  it('should not allow a deactivated employee to access protected route', () => {
    return request(app.getHttpServer())
      .get('/api/auth/me')
      .set({ Authorization: `Bearer ${deactivatedUserToken}` })
      .accept('application/json')
      .expect(401)
  });
});
