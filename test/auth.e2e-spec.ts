import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { configureApp } from 'configure-app';
import { RolesEnum } from 'enums/roles.enum';
import { StatusEnum } from 'enums/status.enum';
import { UserDocument } from 'schemas/user.schema';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { userMock } from './mocks/user.mock';
import { cleanupDocuments } from './utils/cleanup-document';
import { createUser, signToken } from './utils/user';

describe('AuthController (e2e)', () => {
  let app: NestExpressApplication;
  let deactivatedUserToken: string;
  const user = userMock();
  const deactivatedUser = userMock();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    await createUser(app, user);
    const deactivatedUserDocument = await createUser(app, {
      ...deactivatedUser,
      status: StatusEnum.DEACTIVATED
    }) as UserDocument;
    deactivatedUserToken = await signToken(app, deactivatedUserDocument);

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
