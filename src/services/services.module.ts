import Joi from '@hapi/joi';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BcryptService } from './bcrypt/bcrypt.service';
import { ConfigService } from './config/config.service';
import { MongooseConfigService } from './mongoose-config/mongoose-config.service';

const providers = [ConfigService, MongooseConfigService, BcryptService];

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3500),
        MONGO_URI: Joi.string().uri().required(),
      }).required()
    }),
  ],
  providers,
  exports: providers
})
export class ServicesModule { }
