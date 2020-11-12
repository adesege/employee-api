import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemasModule } from 'schemas/schemas.module';
import { JwtConfigService } from 'services/jwt-config/jwt-config.service';
import { MongooseConfigService } from 'services/mongoose-config/mongoose-config.service';
import { ControllersModule } from './controllers/controllers.module';
import { ServicesModule } from './services/services.module';
import { ValidationsModule } from './validations/validations.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    SchemasModule,
    ServicesModule,
    ControllersModule,
    ValidationsModule,
  ],
})
export class AppModule { }
