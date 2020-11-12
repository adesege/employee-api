import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { configureApp } from 'configure-app';
import faker from 'faker';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { userMock } from './mocks/user.mock';
import { cleanupDocuments } from './utils/cleanup-document';
import { createUser } from './utils/user';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const user = userMock();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    await createUser(app, user);
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
        expect(user).toEqual(expect.objectContaining(response.body.user));
      });
  });

  it('should not log an employee in if password is incorrect', () => {
    return request(app.getHttpServer())
      .post('/api/auth/signin')
      .send({ email: user.email, password: faker.internet.password() })
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
});
