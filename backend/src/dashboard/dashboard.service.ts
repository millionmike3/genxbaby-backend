import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiFraudService } from '../ai/ai.fraud.service';
import { AiRiskService } from '../ai/ai.risk.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private aiFraud: AiFraudService,
    private aiRisk: AiRiskService,
  ) {}

  /**
   * Dashboard summary including AI risk prediction
   */
  async getSummary(ownerId: string) {
    const [
      totalChecks,
      flaggedChecks,
      totalDocuments,
      recentActivity,
      ownerRisk,
    ] = await Promise.all([
      this.prisma.check.count({ where: { ownerId } }),
      this.prisma.fraudFlag.count({ where: { ownerId } }),
      this.prisma.ownerDocument.count({ where: { ownerId } }),
      this.getRecentActivity(ownerId),
      this.aiRisk.predictOwnerRisk(ownerId),
    ]);

    return {
      totalChecks,
      flaggedChecks,
      totalDocuments,
      recentActivity,
      ownerRisk,
    };
  }

  /**
   * Recent activity feed (audit logs)
   */
  async getRecentActivity(ownerId: string) {
    return this.prisma.auditLog.findMany({
      where: { ownerId },
      orderBy: { timestamp: 'desc' },
      take: 20,
    });
  }

  /**
   * AI insights for checks (fraud scores)
   */
  async getCheckAiInsights(ownerId: string) {
    return this.prisma.aiCheckInsight.findMany({
      where: {
        check: { ownerId },
      },
      include: {
        check: true,
      },
      orderBy: { score: 'desc' },
    });
  }

  /**
   * AI insights for documents (fraud scores)
   */
  async getDocumentAiInsights(ownerId: string) {
    return this.prisma.aiDocumentInsight.findMany({
      where: {
        document: { ownerId },
      },
      include: {
        document: true,
      },
      orderBy: { score: 'desc' },
    });
  }

  /**
   * AI alerts (high‑risk checks + documents)
   */
  async getAiAlerts(ownerId: string) {
    const [checkInsights, docInsights] = await Promise.all([
      this.getCheckAiInsights(ownerId),
      this.getDocumentAiInsights(ownerId),
    ]);

    const highRiskChecks = checkInsights.filter(i => i.riskLevel === 'HIGH');
    const highRiskDocs = docInsights.filter(i => i.riskLevel === 'HIGH');

    return {
      highRiskChecks,
      highRiskDocs,
      totalAlerts: highRiskChecks.length + highRiskDocs.length,
    };
  }

  /**
   * ⭐ Fraud Heatmap (severity‑weighted fraud density by day)
   */
  async getFraudHeatmap(ownerId: string) {
    const alerts = await this.prisma.fraudAlert.findMany({
      where: { ownerId },
      orderBy: { timestamp: 'asc' },
    });

    const map = {};

    alerts.forEach((a) => {
      const day = new Date(a.timestamp).toISOString().split("T")[0];
      if (!map[day]) map[day] = 0;

      const weight =
        a.severity === "HIGH" ? 3 :
        a.severity === "MEDIUM" ? 2 : 1;

      map[day] += weight;
    });

    return map;
  }
}
