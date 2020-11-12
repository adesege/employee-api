import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IpAddress, IpAddressSchema } from './ip-address.schema';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IpAddress.name, schema: IpAddressSchema },
      { name: User.name, schema: UserSchema },
    ])
  ],
  exports: [MongooseModule]
})
@Global()
export class SchemasModule { }
