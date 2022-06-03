import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { RitualsController } from './rituals/rituals.controller';
import { TypeformService } from './services/typeform/typeform.service';

@Module({
  imports: [],
  controllers: [AppController, RitualsController],
  providers: [TypeformService],
})
export class AppModule {}
