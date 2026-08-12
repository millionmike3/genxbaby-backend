import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsGateway } from './alerts.gateway';
import { AlertsController } from './alerts.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Module({
  providers: [
    PrismaService,
    AuditService,
    AlertsService,
    AlertsGateway,
  ],
  controllers: [AlertsController],
  exports: [AlertsService, AlertsGateway], // ⭐ allows other modules to use alerts
})
export class AlertsModule {}
