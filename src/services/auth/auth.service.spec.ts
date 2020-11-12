import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from 'services/config/config.service';
import { JwtConfigService } from 'services/jwt-config/jwt-config.service';
import { userMock } from '../../../test/mocks/user.mock';
import { User, UserSchema } from '../../schemas/user.schema';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule.forRoot()],
          inject: [ConfigService],
          useClass: JwtConfigService
        })],
      providers: [
        AuthService,
        ConfigService,
        JwtConfigService,
        { provide: getModelToken(User.name), useValue: UserSchema }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call validateUser method', () => {
    const validateUser = jest.fn();
    jest.spyOn(service, 'validateUser').mockImplementation(validateUser)
    service.validateUser(userMock.email, userMock.password);

    expect(validateUser).toBeCalled();
  });

  it('should call signToken method', () => {
    const signToken = jest.fn();
    jest.spyOn(service, 'signToken').mockImplementation(signToken)
    service.signToken(userMock);

    expect(signToken).toBeCalled();
  });

  it('should serialize auth object', () => {
    const user = userMock;
    const json = service.toJSON(user);

    expect(user).toEqual(expect.objectContaining(json));
  });
});
