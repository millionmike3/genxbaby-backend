import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventBus } from '../event-bus.service';
import { FraudAlertsService } from '../../fraud/fraud-alerts.service';
import { CaseCreateService } from '../../cases/case-create.service';

@Injectable()
export class EventConsumer implements OnModuleInit {
  constructor(
    private bus: EventBus,
    private alerts: FraudAlertsService,
    private cases: CaseCreateService,
  ) {}

  onModuleInit() {
    // Fraud events → generate alerts
    this.bus.subscribe('FRAUD_ANALYZED', async (event) => {
      const alerts = await this.alerts.generateAlerts(event.ownerId);

      // Auto-create case if critical alert
      if (alerts.some(a => a.severity === 'CRITICAL')) {
        await this.cases.createCase(event.ownerId, alerts[0].id);
      }
    });

    // Synthetic identity → auto-escalate
    this.bus.subscribe('SYNTHETIC_ANALYZED', async (event) => {
      if (event.payload.syntheticScore >= 70) {
        await this.cases.createCase(event.ownerId);
      }
    });

    // Underwriting decision → create case if declined
    this.bus.subscribe('UNDERWRITING_DECISION', async (event) => {
      if (event.payload.decision === 'DECLINE') {
        await this.cases.createCase(event.ownerId);
      }
    });
  }
}
