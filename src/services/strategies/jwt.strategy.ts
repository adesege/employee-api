import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { StatusEnum } from 'enums/status.enum';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from 'schemas/user.schema';
import { AuthService } from 'services/auth/auth.service';
import { ConfigService } from 'services/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: User): Promise<Partial<User>> {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    const user = await this.userModel
      .findOne({ id: payload.id, status: StatusEnum.ACTIVATED })
      .select(['id', 'firstName', 'lastName', 'roles', 'email']);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user.toJSON() as Partial<User>;
  }
}
