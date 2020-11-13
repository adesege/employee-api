import { getModelToken } from "@nestjs/mongoose";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Model } from "mongoose";
import { IpAddress, IpAddressDocument } from "schemas/ip-address.schema";

export const createIpAddress = (
  app: NestExpressApplication,
  attributes?: Partial<IpAddress>
): Promise<IpAddressDocument> => {
  const ipAddressModel = app.get<Model<IpAddressDocument>>(getModelToken(IpAddress.name));

  return ipAddressModel.create(attributes);
}
