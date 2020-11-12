import { Body, Controller, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDTO } from 'dtos/create-user.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from 'schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  @Post('signup')
  async register(@Body() body: CreateUserDTO): Promise<Record<string, string>> {

    await this.userModel.create(body);

    return { message: 'User registration successfull' };
  }
}
