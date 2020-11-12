import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { StatusEnum } from 'enums/status.enum';
import { Model } from 'mongoose';
import { User, UserDocument } from 'schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.userModel.findOne({
      email: email,
      status: StatusEnum.ACTIVATED
    });
    if (!user) return null;

    const isEqual = await user.comparePassword(password);
    if (isEqual) {
      return { ...this.toJSON(user.toJSON()), password: undefined };
    }
    return null;
  }

  signToken(user: Partial<User>): Promise<string> {
    const payload = this.toJSON(user);
    return this.jwtService.signAsync(payload);
  }

  toJSON(user: Partial<User>): Partial<User> {
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      id: user.id
    }
  }
}
