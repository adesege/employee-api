import { Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Job } from "bull";
import { EMPLOYEE_EVENT_TYPE, UPDATE_EMPLOYEE_EVENT } from "events/types";
import { User } from "schemas/user.schema";
import { MailService } from "services/mail/mail.service";

@Processor(EMPLOYEE_EVENT_TYPE)
@Injectable()
export class EmployeeListener {
  constructor(private readonly mailService: MailService) { }

  @Process(UPDATE_EMPLOYEE_EVENT)
  async updateEmployee(job: Job<User>): Promise<void> {
    const employee = job.data;

    await this.mailService.send({
      to: employee.email,
      subject: 'Account information updated',
      html: `
        <p>Dear ${employee.firstName},</p>
        <p>This is to inform you that your account information has been updated successfully</p>
        <p>Cheers!</p>
    `});
  }
}
