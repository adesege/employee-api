import { User } from "schemas/user.schema";
import { BaseTransformer } from "./base.transformer";

export class EmployeeTransformer extends BaseTransformer<User> {

  transform(entity: Partial<User>): Partial<User> {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email
    }
  }

}
