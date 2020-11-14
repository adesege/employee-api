import { Test, TestingModule } from '@nestjs/testing';
import faker from 'faker';
import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  let service: BcryptService;
  let hashedPassword: string;
  const password = faker.internet.password();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
    hashedPassword = await service.hash(password);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call hash method', async () => {
    expect(hashedPassword).toEqual(hashedPassword);
  });

  it('should call compare method', async () => {
    const isValid = await service.compare(password, hashedPassword);

    expect(isValid).toBeTruthy()
  });
});
