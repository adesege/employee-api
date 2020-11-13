import {
  ExecutionContext,
  mixin
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard, IAuthGuard, Type } from '@nestjs/passport';
import { RolesEnum } from 'enums/roles.enum';
import { Request } from 'express';
import memoize from 'lodash.memoize';
import { Model } from 'mongoose';
import { IpAddress, IpAddressDocument } from 'schemas/ip-address.schema';
import { UserDocument } from 'schemas/user.schema';
import { normalizeIpAddress } from 'utils/normalize-ip';

function createBaseGuard(role: RolesEnum) {
  class MixinBaseGuard extends AuthGuard('jwt') {
    constructor(@InjectModel(IpAddress.name) private readonly ipAddressModel: Model<IpAddressDocument>) {
      super()
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest<Request>();
      const user = request.user as UserDocument;
      return user.roles.includes(role) && this.verifyIpIsWhitelisted(request, user)
    }

    async verifyIpIsWhitelisted(request: Request, user: UserDocument): Promise<boolean> {
      const ipAddresses = await this.ipAddressModel.find({ user: user._id });
      const isWhiteListed = !!ipAddresses.find(item => item.address === normalizeIpAddress(request));
      const isNotSystemAdmin = !user.roles.includes(RolesEnum.SYSTEM_ADMIN);
      return isNotSystemAdmin ? isWhiteListed : true;
    }
  }
  return mixin(MixinBaseGuard);
}

export const BaseGuard: (
  role: RolesEnum,
) => Type<IAuthGuard> = memoize(createBaseGuard);
