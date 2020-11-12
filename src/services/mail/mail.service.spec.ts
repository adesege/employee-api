import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { userMock } from '../../../test/mocks/user.mock';
import { ConfigService } from '../config/config.service';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [MailService, ConfigService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be call sendMail method', () => {
    const send = jest.fn()
    jest.spyOn(service, 'send').mockImplementation(send);
    service.send({ to: userMock.email });

    expect(send).toBeCalled();
  });
});
