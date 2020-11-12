import Joi from '@hapi/joi';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { BcryptService } from './bcrypt/bcrypt.service';
import { ConfigService } from './config/config.service';
import { JwtConfigService } from './jwt-config/jwt-config.service';
import { MongooseConfigService } from './mongoose-config/mongoose-config.service';

const providers = [
  ConfigService,
  MongooseConfigService,
  BcryptService,
  AuthService,
  JwtConfigService
];

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
        JWT_EXPIRES_IN: Joi.string().default('1d'),
        JWT_SECRET: Joi.string().required(),
      }).required()
    }),
  ],
  providers,
  exports: providers,
})
export class ServicesModule { }
