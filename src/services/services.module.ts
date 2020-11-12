import Joi from '@hapi/joi';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { BcryptService } from './bcrypt/bcrypt.service';
import { BullConfigService } from './bull-config/bull-config.service';
import { ConfigService } from './config/config.service';
import { IpAddressService } from './ip-address/ip-address.service';
import { JwtConfigService } from './jwt-config/jwt-config.service';
import { MailService } from './mail/mail.service';
import { MongooseConfigService } from './mongoose-config/mongoose-config.service';
import { JwtStrategy } from './strategies/jwt.strategy';

const providers = [
  ConfigService,
  MongooseConfigService,
  BcryptService,
  AuthService,
  JwtConfigService,
  JwtStrategy,
  IpAddressService,
  BullConfigService,
  MailService
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
        QUEUE_URL: Joi.string().uri().required(),
        SMTP_URL: Joi.string().uri().required(),
        MAIL_FROM: Joi.string().default('noreply@employee-api.com'),
      }).required()
    }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  providers,
  exports: providers,
})
export class ServicesModule { }
