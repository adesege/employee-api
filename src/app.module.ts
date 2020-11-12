import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { SchemasModule } from 'schemas/schemas.module';
import { BullConfigService } from 'services/bull-config/bull-config.service';
import { MongooseConfigService } from 'services/mongoose-config/mongoose-config.service';
import { ControllersModule } from './controllers/controllers.module';
import { EventsModule } from './events/events.module';
import { ListenersModule } from './listeners/listeners.module';
import { ServicesModule } from './services/services.module';
import { ValidationsModule } from './validations/validations.module';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    BullModule.forRootAsync({
      useClass: BullConfigService,
    }),
    SchemasModule,
    ServicesModule,
    ControllersModule,
    ValidationsModule,
    EventsModule,
    ListenersModule,
  ],
})
export class AppModule { }
