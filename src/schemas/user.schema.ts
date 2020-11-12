import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RolesEnum } from 'enums/roles.enum';
import { Document } from 'mongoose';
import { BcryptService } from 'services/bcrypt/bcrypt.service';
import { uuid } from 'utils/uuid';

const bcryptService = new BcryptService();

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: [RolesEnum.EMPLOYEE], enum: Object.values(RolesEnum) })
  roles?: RolesEnum[];

  comparePassword: (value: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.comparePassword = function comparePassword(value: string): Promise<boolean> {
  return bcryptService.compare(value, this.password)
};

UserSchema.pre<UserDocument>('save', async function encryptPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcryptService.hash(this.password);
});

UserSchema.pre<UserDocument>('save', async function autoGenerateId() {
  if (!!this.id) return;
  this.id = uuid()
});
