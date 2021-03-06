import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RolesEnum } from 'enums/roles.enum';
import { StatusEnum } from 'enums/status.enum';
import { Document, Types } from 'mongoose';
import { autoGenerateId } from 'utils/auto-generate-id';
import { compareUserSchemaPassword, encryptUserSchemaPassword } from 'utils/bcrypt-schema-helper';
import { IpAddress } from './ip-address.schema';

export type UserDocument = User & Document;
type UserBankType = { accountNumber: number; };

// TODO: Auto get the schema name by avoiding circular dependency
const IP_ADDRESS_NAME = 'IpAddress';

@Schema()
export class User {
  @Prop({ unique: true })
  id?: string;

  @Prop({ required: true })
  firstName?: string;

  @Prop({ required: true })
  lastName?: string;

  @Prop({ required: true, unique: true })
  email?: string;

  @Prop({ required: true })
  password?: string;

  @Prop()
  phone?: string;

  @Prop(raw({ accountNumber: { type: Number } }))
  bank?: UserBankType;

  @Prop({ type: [Types.ObjectId], ref: IP_ADDRESS_NAME })
  ipAddresses?: IpAddress[];

  @Prop({ type: [String], default: [RolesEnum.EMPLOYEE], enum: Object.values(RolesEnum) })
  roles?: RolesEnum[];

  @Prop({ type: String, default: StatusEnum.ACTIVATED, enum: Object.values(StatusEnum) })
  status?: StatusEnum;

  comparePassword: (value: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

UserSchema.methods.comparePassword = compareUserSchemaPassword;

UserSchema.pre<UserDocument>('save', encryptUserSchemaPassword);
UserSchema.pre<UserDocument>('save', autoGenerateId);
