import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { MongooseConfigService } from 'services/mongoose-config/mongoose-config.service';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    ServicesModule
  ],
})
export class AppModule { }
