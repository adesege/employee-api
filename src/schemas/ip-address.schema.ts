import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { autoGenerateId } from "utils/auto-generate-id";
import { User } from "./user.schema";

export type IpAddressDocument = IpAddress & Document;

// TODO: Auto get the schema name by avoiding circular dependency
const USER_NAME = 'User';

@Schema()
export class IpAddress {
  @Prop({ unique: true })
  id?: string;

  @Prop({ required: true, index: true })
  address?: string;

  @Prop({ type: Types.ObjectId, ref: USER_NAME, index: true, })
  user?: User;
}

export const IpAddressSchema = SchemaFactory.createForClass(IpAddress);

IpAddressSchema.pre<IpAddressDocument>('save', autoGenerateId);
