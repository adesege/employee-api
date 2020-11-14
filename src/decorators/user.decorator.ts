import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'schemas/user.schema';

export const UserDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext): Partial<User> => {
    const request = ctx.switchToHttp().getRequest();

    return data ? request.user[data] : request.user || /* istanbul ignore next */ {};
  },
);
