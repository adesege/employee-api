import { Module } from '@nestjs/common';
import { IsEmailUniqueConstraint } from './is-email-unique';

@Module({
  providers: [IsEmailUniqueConstraint]
})
export class ValidationsModule { }
