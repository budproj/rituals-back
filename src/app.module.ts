import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { CommentsController } from './comments/comments.controller';
import { RitualsController } from './rituals/rituals.controller';

import { TypeformService } from './services/typeform/typeform.service';
import { CusdisService } from './services/cusdis/cusdis.service';
import { MailService } from './services/mail/mail.service';

@Module({
  imports: [],
  controllers: [AppController, RitualsController, CommentsController],
  providers: [TypeformService, CusdisService, MailService],
})
export class AppModule {}
