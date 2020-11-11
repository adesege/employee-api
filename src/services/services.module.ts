import Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from './config/config.service';
import { MongooseConfigService } from './mongoose-config/mongoose-config.service';

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
  providers: [ConfigService, MongooseConfigService]
})
export class ServicesModule { }
