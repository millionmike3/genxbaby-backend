import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AlertRulesService } from './alert-rules.service';
import { AlertTriggerService } from './alert-trigger.service';
import { AlertDispatcherService } from './alert-dispatcher.service';
import { FraudAlertsService } from './fraud-alerts.service';
import { AlertsController } from './alerts.controller';

@Module({
  imports: [PrismaModule],
  providers: [
    AlertRulesService,
    AlertTriggerService,
    AlertDispatcherService,
    FraudAlertsService,
  ],
  controllers: [AlertsController],
  exports: [FraudAlertsService],
})
export class AlertsModule {}
