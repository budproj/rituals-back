import { Controller, Get } from '@nestjs/common';
import { HealthCheckResponse } from './app.dto';

@Controller()
export class AppController {
  @Get()
  healthCheck(): HealthCheckResponse {
    return { apiStatus: 'ok' };
  }
}
