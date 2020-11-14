import faker from 'faker';

export const ipAddressFixture = {
  id: faker.random.uuid(),
  ipAddress: faker.internet.ip(),
  isModified(): boolean {
    return true
  },
  save(): typeof ipAddressFixture {
    return ipAddressFixture;
  }
}

type ipAddressFixtureType = typeof ipAddressFixture;

export const IpAddressModel = {
  findOne(): Promise<ipAddressFixtureType> {
    return Promise.resolve(ipAddressFixture)
  },
  create(): Promise<ipAddressFixtureType> {
    return Promise.resolve(ipAddressFixture)
  }
}
