import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { SchemasModule } from 'schemas/schemas.module';
import { MongooseConfigService } from 'services/mongoose-config/mongoose-config.service';
import { ControllersModule } from './controllers/controllers.module';
import { ServicesModule } from './services/services.module';
import { ValidationsModule } from './validations/validations.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    SchemasModule,
    ServicesModule,
    ControllersModule,
    ValidationsModule,
  ],
})
export class AppModule { }
