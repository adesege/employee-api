import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from 'services/config/config.service';

@Injectable()
export class MailService {
  private transporter: Mail;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport(this.configService.get('SMTP_URL'))
  }

  send(options: Mail.Options): Promise<any> {
    return this.transporter.sendMail({
      from: this.configService.get('MAIL_FROM'),
      ...options
    });
  }
}
