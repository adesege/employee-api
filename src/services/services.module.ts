import Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3500),
        MONGO_USERNAME: Joi.string().uri().required(),
        MONGO_PASSWORD: Joi.string().required(),
        MONGO_PORT: Joi.string().default(27017),
        MONGO_DB: Joi.string().required(),
      }).required()
    }),
  ],
  providers: [ConfigService]
})
export class ServicesModule { }
