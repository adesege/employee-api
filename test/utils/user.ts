import { INestApplication } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "schemas/user.schema";
import { userMock } from "../mocks/user.mock";

export const createUser = (app: INestApplication, attributes?: Partial<User>): Promise<UserDocument> => {
  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
  return userModel.create({ ...userMock, ...attributes });
}
