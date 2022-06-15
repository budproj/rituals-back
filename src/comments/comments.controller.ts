import { Body, Controller, Post } from '@nestjs/common';

import {
  CusdisService,
  CusdisWebhook,
} from 'src/services/cusdis/cusdis.service';

import { WebhookResponse } from './comments.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly cusdis: CusdisService) {}

  @Post('/webhook')
  async webhookHandler(@Body() hook: CusdisWebhook): Promise<WebhookResponse> {
    if (hook.type === 'new_comment') {
      const commentApproved = await this.cusdis.approveComment(hook.data);
      return { commentApproved };
    }

    throw Error('Hook type not supported');
  }
}
