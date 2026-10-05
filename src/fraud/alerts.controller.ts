import { Controller, Post, Param } from '@nestjs/common';
import { FraudAlertsService } from './fraud-alerts.service';
import { AlertTriggerService } from './alert-trigger.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly trigger: AlertTriggerService) {}

  @Post('owner/:id')
  async generate(@Param('id') id: string) {
    return this.trigger.generateAlertsForOwner(id);
  }
}
