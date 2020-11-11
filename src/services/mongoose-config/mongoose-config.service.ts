import { Injectable } from "@nestjs/common";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose/dist";
import { ConfigService } from "services/config/config.service";

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) { }

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get('MONGO_URI')
    };
  }
}
