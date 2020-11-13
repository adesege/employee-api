import { Body, Controller, Get, HttpCode, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserDecorator } from 'decorators/user.decorator';
import { SigninDTO } from 'dtos/signin.dto';
import { EmployeeGuard } from 'guards/employee.guard';
import { User } from 'schemas/user.schema';
import { AuthService } from 'services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signin')
  @HttpCode(200)
  async login(@Body() body: SigninDTO): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.authService.validateUser(body.email, body.password)
    if (!user) {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    const token = await this.authService.signToken(user);

    return { token, user: this.authService.toJSON(user) }
  }

  @Get('me')
  @UseGuards(EmployeeGuard)
  me(@UserDecorator() user: User): Partial<User> {
    return this.authService.toJSON(user);
  }
}
