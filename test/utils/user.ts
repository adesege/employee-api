import { INestApplication } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "schemas/user.schema";
import { AuthService } from "services/auth/auth.service";

export const createUser = (
  app: INestApplication,
  attributes?: Partial<User> | Partial<User>[]
): Promise<UserDocument> | Promise<UserDocument[]> => {
  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

  // TODO: Refactor
  return Array.isArray(attributes) ? userModel.create(attributes) : userModel.create(attributes);
}

export const signToken = (app: INestApplication, payload: Partial<User>): Promise<string> => {
  const authService = app.get(AuthService);
  return authService.signToken(payload);
}
