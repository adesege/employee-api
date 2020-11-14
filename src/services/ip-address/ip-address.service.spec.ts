import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { IpAddress } from 'schemas/ip-address.schema';
import { ipAddressFixture, IpAddressModel } from '../../../test/mocks/ip-address.mock';
import { IpAddressService } from './ip-address.service';

describe('IpAddressService', () => {
  let service: IpAddressService;
  let ipAddressModel: typeof IpAddressModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IpAddressService,
        { provide: getModelToken(IpAddress.name), useValue: IpAddressModel }
      ],
    }).compile();

    service = module.get<IpAddressService>(IpAddressService);
    ipAddressModel = module.get<typeof IpAddressModel>(getModelToken(IpAddress.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateOrCreate methods', () => {
    it('should call updateOrCreate method', async () => {
      jest.spyOn<typeof IpAddressModel, 'findOne'>(ipAddressModel, 'findOne').mockResolvedValue(ipAddressFixture);
      const updateOrCreate = await service.updateOrCreate({}, {});

      expect(updateOrCreate).toContain(ipAddressFixture);
    });

    it('should call updateOrCreate method when ipAddress has not been modified', async () => {
      jest.spyOn(ipAddressFixture, 'isModified').mockReturnValue(false);
      jest.spyOn<typeof IpAddressModel, 'findOne'>(ipAddressModel, 'findOne').mockResolvedValue(ipAddressFixture);
      const updateOrCreate = await service.updateOrCreate({}, {});

      expect(updateOrCreate).toContain(ipAddressFixture);
    });

    it('should call updateOrCreate method when ipAddress has not been modified', async () => {
      jest.spyOn<typeof IpAddressModel, 'findOne'>(ipAddressModel, 'findOne').mockResolvedValue(null);
      const updateOrCreate = await service.updateOrCreate({}, {});

      expect(updateOrCreate).toContain(ipAddressFixture);
    });
  });

});
