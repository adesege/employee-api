import { Module } from '@nestjs/common';
import { IsEmailExistConstraint } from './is-email-exist';
import { IsEmailUniqueConstraint } from './is-email-unique';

@Module({
  providers: [IsEmailUniqueConstraint, IsEmailExistConstraint]
})
export class ValidationsModule { }
