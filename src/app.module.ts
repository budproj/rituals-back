import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { CommentsController } from './comments/comments.controller';
import { RitualsController } from './rituals/rituals.controller';
import { TypeformService } from './services/typeform/typeform.service';
import { CusdisService } from './services/cusdis/cusdis.service';

@Module({
  imports: [],
  controllers: [AppController, RitualsController, CommentsController],
  providers: [TypeformService, CusdisService],
})
export class AppModule {}
