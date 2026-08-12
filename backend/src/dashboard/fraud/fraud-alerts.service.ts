import { Injectable } from '@nestjs/common';
import { AlertTriggerService } from './alert-trigger.service';
import { AlertDispatcherService } from './alert-dispatcher.service';

@Injectable()
export class FraudAlertsService {
  constructor(
    private trigger: AlertTriggerService,
    private dispatcher: AlertDispatcherService,
  ) {}

  async generateAlerts(ownerId: string) {
    const alerts = await this.trigger.run(ownerId);

    for (const alert of alerts) {
      await this.dispatcher.dispatch(alert);
    }

    return alerts;
  }
}
