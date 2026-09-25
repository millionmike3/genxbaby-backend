import { Controller, Post, Param } from '@nestjs/common';
import { FraudAlertsService } from './fraud-alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private alerts: FraudAlertsService) {}

  @Post('owner/:id')
  async generate(@Param('id') id: string) {
    return this.alerts.generateAlerts(id);
  }
}
