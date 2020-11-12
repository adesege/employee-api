import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDTO } from 'dtos/create-user.dto';
import { SigninDTO } from 'dtos/signin.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from 'schemas/user.schema';
import { AuthService } from 'services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly authService: AuthService
  ) { }

  @Post('signup')
  async register(@Body() body: CreateUserDTO): Promise<Record<string, string>> {

    await this.userModel.create({ ...body, email: body.email.toLowerCase() });

    return { message: 'User registration successfull' };
  }

  @Post('signin')
  async login(@Body() body: SigninDTO): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.authService.validateUser(body.email, body.password)
    if (!user) {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    const token = await this.authService.signToken(user);

    return { token, user }
  }
}
