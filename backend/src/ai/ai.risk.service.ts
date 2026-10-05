import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class AiRiskService {
  constructor(
    private prisma: PrismaService,
    private alerts: AlertsService,   // ⭐ REQUIRED for OWNER_RISK_SPIKE alerts
  ) {}

  async predictOwnerRisk(ownerId: string) {
    const [
      checks,
      docs,
      fraudFlags,
      riskHistory,
    ] = await Promise.all([
      this.prisma.check.findMany({ where: { ownerId } }),
      this.prisma.ownerDocument.findMany({ where: { ownerId } }),
      this.prisma.fraudFlag.findMany({ where: { ownerId } }),
      this.prisma.riskHistoryLog.findMany({ where: { ownerId } }),
    ]);

    const score =
      (checks.length * 2) +
      (docs.length * 1) +
      (fraudFlags.length * 20) +
      (riskHistory.length * 10);

    const risk = {
      ownerId,
      score,
      riskLevel: score > 100 ? 'HIGH' : score > 50 ? 'MEDIUM' : 'LOW',
    };

    // ⭐ HIGH-RISK OWNER ALERT TRIGGER
    if (risk.riskLevel === 'HIGH') {
      await this.alerts.createAlert(
        ownerId,
        'OWNER_RISK_SPIKE',
        'HIGH',
        risk,
        'SYSTEM',   // AI-generated alert
      );
    }

    return risk;
  }
}
