import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { IpAddress, IpAddressSchema } from 'schemas/ip-address.schema';
import { IpAddressService } from './ip-address.service';

describe('IpAddressService', () => {
  let service: IpAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IpAddressService,
        { provide: getModelToken(IpAddress.name), useValue: IpAddressSchema }
      ],
    }).compile();

    service = module.get<IpAddressService>(IpAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
