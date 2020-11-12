import {
  ExecutionContext,
  mixin
} from '@nestjs/common';
import { AuthGuard, IAuthGuard, Type } from '@nestjs/passport';
import { RolesEnum } from 'enums/roles.enum';
import { Request } from 'express';
import memoize from 'lodash.memoize';
import { User } from 'schemas/user.schema';

function createBaseGuard(role: RolesEnum) {
  class MixinBaseGuard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest<Request>();
      const user = request.user as User;
      return user.roles.includes(role)
    }
  }
  return mixin(MixinBaseGuard);
}

export const BaseGuard: (
  role: RolesEnum,
) => Type<IAuthGuard> = memoize(createBaseGuard);
