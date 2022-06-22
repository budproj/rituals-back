import { Body, Controller, Post } from '@nestjs/common';

import {
  CusdisService,
  CusdisWebhook,
} from 'src/services/cusdis/cusdis.service';
import { MailService } from 'src/services/mail/mail.service';

import { WebhookResponse } from './comments.dto';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly cusdis: CusdisService,
    private readonly mail: MailService,
  ) {}

  @Post('/webhook')
  async webhookHandler(@Body() hook: CusdisWebhook): Promise<WebhookResponse> {
    if (hook.type === 'new_comment') {
      const splittedEmail = hook.data.by_email.split('|');
      const appUrl = splittedEmail.length === 2 ? splittedEmail[0] : '#';
      const userEmail =
        splittedEmail.length === 2 ? splittedEmail[1] : splittedEmail[0];

      const emailConfig = {
        from: 'Try Rituals <notification@tryrituals.com>',
        to: userEmail,
        subject: 'Você tem um novo comentário no seu check-in!',
        text: `Você tem um novo comentário no seu check-in. ${hook.data.by_nickname}: ${hook.data.content}`,
        html: 'checkin-reply',
      };

      const dataReplacement = [
        {
          from: '{{date}}',
          to: new Intl.DateTimeFormat('pt-BR', {
            timeStyle: 'short',
            dateStyle: 'medium',
          }).format(new Date()),
        },
        { from: '{{user}}', to: hook.data.by_nickname },
        { from: '{{message}}', to: hook.data.content },
        { from: '{{appUrl}}', to: appUrl },
      ];

      const commentApproved = await this.cusdis.approveComment(hook.data);
      await this.mail.sendMail(emailConfig, dataReplacement);
      return { commentApproved };
    }

    throw Error('Hook type not supported');
  }
}
