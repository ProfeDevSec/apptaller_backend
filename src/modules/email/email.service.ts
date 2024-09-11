import { Injectable } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  @OnEvent('user.reset-password')
  async forgotPasswordEmail(data) {
    console.log(process.env);

    const { email, password, nombre } = data;
    console.log(data);

    const subject = `password recovery`;

    await this.mailerService
      .sendMail({
        to: email,
        subject,
        template: './forgot-password',
        context: {
          email,
          password,
          nombre,
        },
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
}
