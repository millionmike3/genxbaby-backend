import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiRiskTrendService } from './ai.risk-trend.service';

@Injectable()
export class AiRiskProfileService {
  constructor(
    private prisma: PrismaService,
    private trend: AiRiskTrendService,
  ) {}

  async getOwnerRiskProfile(ownerId: string) {
    const ownerRisk = await this.prisma.ownerRisk.findUnique({
      where: { ownerId },
    });

    const recentAlerts = await this.prisma.fraudAlert.findMany({
      where: { ownerId },
      orderBy: { timestamp: 'desc' },
      take: 5,
    });

    const trendData = await this.trend.getRiskTrend(ownerId);

    const topDrivers = await this.prisma.aiCheckInsight.findMany({
      where: { check: { ownerId } },
      orderBy: { score: 'desc' },
      take: 3,
      include: { check: true },
    });

    return {
      riskLevel: ownerRisk?.riskLevel || "UNKNOWN",
      score: ownerRisk?.score || 0,
      trend: trendData.trend,
      recentAlerts,
      topDrivers,
      summary: this.generateSummary(ownerRisk, trendData, recentAlerts, topDrivers),
    };
  }

  generateSummary(risk, trend, alerts, drivers) {
    const riskText =
      risk.riskLevel === "HIGH"
        ? "The owner is currently exhibiting high fraud risk indicators."
        : risk.riskLevel === "MEDIUM"
        ? "The owner shows moderate risk with several concerning patterns."
        : "The owner’s risk level is currently low.";

    const trendText =
      trend.trend === "WORSENING"
        ? "Risk is increasing based on recent activity."
        : trend.trend === "IMPROVING"
        ? "Risk is decreasing and trending positively."
        : "Risk remains stable with no major changes.";

    const alertText =
      alerts.length > 0
        ? `Recent alerts include ${alerts[0].type.replace(/_/g, " ").toLowerCase()} and other related events.`
        : "No recent alerts detected.";

    const driverText =
      drivers.length > 0
        ? `Top fraud drivers include check #${drivers[0].check.id} and similar high‑risk items.`
        : "No major fraud drivers detected.";

    return `${riskText} ${trendText} ${alertText} ${driverText}`;
  }
}
