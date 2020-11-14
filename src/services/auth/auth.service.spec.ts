import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from 'services/config/config.service';
import { JwtConfigService } from 'services/jwt-config/jwt-config.service';
import { userMock, UserModel, userModelFixture } from '../../../test/mocks/user.mock';
import { User } from '../../schemas/user.schema';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: typeof UserModel;

  const user = userMock();
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
        { provide: getModelToken(User.name), useValue: UserModel }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<typeof UserModel>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call validateUser method', () => {
    const validateUser = jest.spyOn(service, 'validateUser');
    service.validateUser(user.email, user.password);

    expect(validateUser).toBeCalled();
  });

  it('should return null if user cannot be found', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
    const validateUser = await service.validateUser(user.email, user.password);

    expect(validateUser).toEqual(null);
  });

  it('should return user with no password field if user is authenticated', async () => {
    jest.spyOn(userModel, 'findOne').mockResolvedValue({ ...userModelFixture, comparePassword: () => true });
    const validateUser = await service.validateUser(user.email, user.password);

    expect(validateUser.password).not.toBeDefined();
  });

  it('should call signToken method', () => {
    const signToken = jest.spyOn(service, 'signToken');
    service.signToken(user);

    expect(signToken).toBeCalled();
  });

  it('should serialize auth object', () => {
    const json = service.toJSON(user);

    expect(user).toEqual(expect.objectContaining(json));
  });
});
