import { IpAddress } from "schemas/ip-address.schema";
import { User } from "schemas/user.schema";
import { BaseTransformerInterface } from "./base-transformer.interface";
import { BaseTransformer } from "./base.transformer";

export class IpAddressTransformer extends BaseTransformer<IpAddress> implements BaseTransformerInterface<User> {

  transform(entity: Partial<IpAddress>): Partial<IpAddress> {
    return {
      address: entity.address,
      id: entity.id
    }
  }
}
