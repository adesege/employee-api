import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../config/config.service';
import { MongooseConfigService } from './mongoose-config.service';

describe('MongooseConfigService', () => {
  let service: MongooseConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongooseConfigService, ConfigService],
    }).compile();

    service = module.get<MongooseConfigService>(MongooseConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
