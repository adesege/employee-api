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
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  async validate(email = ''): Promise<boolean> {
    const user = await this.userModel.findOne({ email: { $regex: email, $options: 'i' } });
    return !user;
  }


  defaultMessage(): string {
    return 'An employee with this email address already exist';
  }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailUniqueConstraint,
    });
  };
}
