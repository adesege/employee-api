import { Test, TestingModule } from '@nestjs/testing';
import { BullConfigService } from './bull-config.service';

describe('BullConfigService', () => {
  let service: BullConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BullConfigService],
    }).compile();

    service = module.get<BullConfigService>(BullConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
