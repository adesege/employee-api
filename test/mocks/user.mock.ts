import { RolesEnum } from 'enums/roles.enum';
import { StatusEnum } from 'enums/status.enum';
import faker from 'faker';
import { User } from 'schemas/user.schema';

export const userMock = (): Partial<User> => ({
  id: faker.random.uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  phone: faker.phone.phoneNumber('+2348#########'),
  roles: [RolesEnum.EMPLOYEE],
  status: StatusEnum.ACTIVATED,
  bank: { accountNumber: faker.random.number(1000000000) }
})
