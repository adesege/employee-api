import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BcryptService } from 'services/bcrypt/bcrypt.service';

const bcryptService = new BcryptService();

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: ['employee'] })
  roles?: string[];

  comparePassword(value: string): Promise<boolean> {
    return bcryptService.compare(value, this.password)
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function save() {
  if (!this.isModified('password')) return;
  this.password = await bcryptService.hash(this.password);
});
