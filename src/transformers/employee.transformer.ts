import { IpAddress } from "schemas/ip-address.schema";
import { User } from "schemas/user.schema";
import { BaseTransformer } from "./base.transformer";
import { IpAddressTransformer } from "./ip-address.transformer";

export class EmployeeTransformer extends BaseTransformer<User> {

  transform(entity: Partial<User>): Partial<User> {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      ipAddresses: entity.ipAddresses ?
        new IpAddressTransformer(entity.ipAddresses) as unknown as Partial<IpAddress>[] :
        [],
      status: entity.status,
      phone: entity.phone,
      bank: entity.bank
    }
  }

}
