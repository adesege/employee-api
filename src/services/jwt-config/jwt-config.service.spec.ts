import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../config/config.service';
import { JwtConfigService } from './jwt-config.service';

describe('JwtConfigService', () => {
  let service: JwtConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtConfigService, ConfigService],
    }).compile();

    service = module.get<JwtConfigService>(JwtConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
