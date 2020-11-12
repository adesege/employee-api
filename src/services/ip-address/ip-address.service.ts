import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseFilterQuery } from 'mongoose';
import { IpAddress, IpAddressDocument } from 'schemas/ip-address.schema';

@Injectable()
export class IpAddressService {
  constructor(
    @InjectModel(IpAddress.name) private readonly ipAddressModel: Model<IpAddressDocument>,
  ) { }

  async updateOrCreate(
    filter: MongooseFilterQuery<Pick<IpAddressDocument, "_id" | "address" | "user">>,
    attributes: Partial<IpAddress>
  ): Promise<IpAddress[]> {
    const ipAddress = await this.ipAddressModel.findOne(filter);
    if (ipAddress) {
      ipAddress.address = attributes.address;
      ipAddress.user = attributes.user;
      if (!ipAddress.isModified()) return [ipAddress];
      return [await ipAddress.save()];
    }

    return [await this.ipAddressModel.create(attributes)];
  }
}
