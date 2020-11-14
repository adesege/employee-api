import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseFilterQuery } from 'mongoose';
import { IpAddress, IpAddressDocument } from 'schemas/ip-address.schema';

@Injectable()
export class IpAddressService {
  constructor(
    @InjectModel(IpAddress.name) private readonly ipAddressModel: Model<IpAddressDocument>,
  ) { }

  async createNew(
    filter: MongooseFilterQuery<Pick<IpAddressDocument, "_id" | "address" | "user">>,
    attributes: Partial<IpAddress>
  ): Promise<IpAddress[]> {
    const ipAddress = await this.ipAddressModel.findOne(filter);
    if (ipAddress) {
      return [ipAddress];
    }

    return [await this.ipAddressModel.create(attributes)];
  }
}
