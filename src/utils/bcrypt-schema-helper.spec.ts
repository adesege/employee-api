import faker from 'faker';
import { BcryptService } from 'services/bcrypt/bcrypt.service';
import { compareUserSchemaPassword, encryptUserSchemaPassword } from "./bcrypt-schema-helper";

describe('BcryptSchemaHelper', () => {
  jest.mock('./bcrypt-schema-helper');

  describe('encryptUserSchemaPassword', () => {
    it('should encrypt user password', async () => {
      const encryptPassword = await encryptUserSchemaPassword.call({
        isModified: () => true,
        password: faker.internet.password()
      });

      expect(encryptPassword).toBeUndefined();
    });

    it('should not encrypt user password if it has not being modified', async () => {
      const encryptPassword = await encryptUserSchemaPassword.call({ isModified: () => false });

      expect(encryptPassword).toBeUndefined();
    });
  });

  describe('compareUserSchemaPassword', () => {
    let hashedPassword: string;

    const bcrytService = new BcryptService();
    const password = faker.internet.password();

    beforeEach(async () => {
      hashedPassword = await bcrytService.hash(password);
    })

    it('should compare user password', async () => {
      const isValid = await compareUserSchemaPassword.call({ password: hashedPassword }, password);

      expect(isValid).toBeTruthy();
    });

    it('should not compare user password if password is incorrect', async () => {
      const isValid = await compareUserSchemaPassword.call(
        { password: hashedPassword },
        faker.internet.password()
      );

      expect(isValid).toBeFalsy();
    });
  })

});
