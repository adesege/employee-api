import { BullModuleOptions } from '@nestjs/bull';
import { SharedBullConfigurationFactory } from '@nestjs/bull/dist/interfaces/shared-bull-config.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'services/config/config.service';

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  constructor(private readonly configService: ConfigService) { }

  createSharedConfiguration(): BullModuleOptions {
    return {
      redis: this.configService.get('QUEUE_URL'),
    };
  }
}
