import { IpAddress } from "schemas/ip-address.schema";
import { BaseTransformer } from "./base.transformer";

export class IpAddressTransformer extends BaseTransformer<IpAddress> {

  transform(entity: Partial<IpAddress>): Partial<IpAddress> {
    return {
      address: entity.address,
      id: entity.id
    }
  }
}
