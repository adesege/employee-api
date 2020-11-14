import { BcryptService } from "services/bcrypt/bcrypt.service";

const bcryptService = new BcryptService();

export async function encryptUserSchemaPassword(): Promise<void> {
  if (!this.isModified('password')) return;
  this.password = await bcryptService.hash(this.password);
}

export function compareUserSchemaPassword(value: string): Promise<boolean> {
  return bcryptService.compare(value, this.password)
};
