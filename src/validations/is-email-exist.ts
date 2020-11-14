import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  registerDecorator,

  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { Model } from 'mongoose';
import { User, UserDocument } from 'schemas/user.schema';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailExistConstraint implements ValidatorConstraintInterface {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  async validate(email: string): Promise<boolean> {
    if (!email) {
      return true;
    }
    const user = await this.userModel.findOne({ email: { $regex: email, $options: 'i' } });
    return !!user;
  }

  defaultMessage(): string {
    return 'Email address does not exist';
  }
}

export function IsEmailExist(validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailExistConstraint,
    });
  };
}
