import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { checkinReply } from './templates/checkin-reply';

interface MailDataReplacer {
  from: string;
  to: string;
}

@Injectable()
export class MailService {
  transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  templates: Map<string, string>;

  constructor() {
    this.transporter = this.createTransporter();
    this.templates = new Map([['checkin-reply', checkinReply]]);
  }

  createTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  mountTemplate(
    templateName: nodemailer.SendMailOptions['html'],
    templateData: MailDataReplacer[],
  ): string {
    let template = this.templates.get(templateName.toString()) ?? '';

    templateData.forEach(({ from, to }) => {
      template = template.replace(from, to);
    });

    return template;
  }

  async sendMail(
    mailConfig: nodemailer.SendMailOptions,
    data: MailDataReplacer[],
  ): Promise<any> {
    const template = this.mountTemplate(mailConfig.html, data);
    Object.assign(mailConfig, { html: template });

    const mailResponse = await this.transporter.sendMail(mailConfig);
    return mailResponse;
  }
}
