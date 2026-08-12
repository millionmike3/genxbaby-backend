import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AlertsGateway } from './alerts.gateway';

@Injectable()
export class AlertsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private gateway: AlertsGateway,   // ⭐ REQUIRED FOR REAL-TIME ALERTS
  ) {}

  async createAlert(ownerId: string, type: string, severity: string, meta: any, userId?: string) {
    const alert = await this.prisma.fraudAlert.create({
      data: {
        ownerId,
        type,
        severity,
        meta: JSON.stringify(meta),
        timestamp: new Date(),
      },
    });

    await this.audit.log('FRAUD_ALERT_CREATED', userId || 'SYSTEM', {
      ownerId,
      type,
      severity,
      meta,
    });

    // ⭐ Emit real-time WebSocket alert
    await this.gateway.emitAlert(ownerId, alert);

    return alert;
  }

  async getAlerts(ownerId: string) {
    return this.prisma.fraudAlert.findMany({
      where: { ownerId },
      orderBy: { timestamp: 'desc' },
    });
  }

  async getHighRiskAlerts(ownerId: string) {
    return this.prisma.fraudAlert.findMany({
      where: { ownerId, severity: 'HIGH' },
      orderBy: { timestamp: 'desc' },
    });
  }
}
