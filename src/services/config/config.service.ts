import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { IEnvironmentVariables } from './interfaces/config';

@Injectable()
export class ConfigService extends NestConfigService<IEnvironmentVariables> { }
