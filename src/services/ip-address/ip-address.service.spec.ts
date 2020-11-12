import { Test, TestingModule } from '@nestjs/testing';
import { IpAddressService } from './ip-address.service';

describe('IpAddressService', () => {
  let service: IpAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IpAddressService],
    }).compile();

    service = module.get<IpAddressService>(IpAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
