import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RiskScoringEngine {
  constructor(private prisma: PrismaService) {}

  async computeOwnerRisk(ownerId: string) {
    const [fraudFlags, sarReports, behaviorProfiles, financialHealth, incomeSnapshots] =
      await Promise.all([
        this.prisma.fraudFlag.findMany({
          where: { check: { bankProfile: { ownerId } }, resolved: false },
        }),
        this.prisma.suspiciousActivityReport.findMany({
          where: { check: { bankProfile: { ownerId } } },
        }),
        this.prisma.behaviorProfile.findMany({
          where: { user: { ownerId } },
        }),
        this.prisma.financialHealthSnapshot.findMany({
          where: { ownerId },
          orderBy: { timestamp: 'desc' },
          take: 1,
        }),
        this.prisma.incomeVerificationSnapshot.findMany({
          where: { ownerId },
          orderBy: { timestamp: 'desc' },
          take: 1,
        }),
      ]);

    const fraudScore = Math.min(fraudFlags.length * 10, 100);
    const sarSeverity = Math.min(sarReports.length * 15, 100);

    const behaviorScore =
      behaviorProfiles.length === 0
        ? 50
        : Math.round(
            behaviorProfiles.reduce((sum, p) => sum + p.avgImpulsivenessScore, 0) /
              behaviorProfiles.length,
          );

    const financial = financialHealth[0];
    const bankRiskScore = financial
      ? Math.round(
          (100 - financial.liquidityScore +
            100 - financial.cashFlowScore +
            financial.overdraftRisk) / 3,
        )
      : 50;

    const income = incomeSnapshots[0];
    const incomePenalty = income
      ? Math.round(
          (100 - income.incomeStability +
            100 - income.employerMatch +
            100 - income.bankMatch) / 3,
        )
      : 20;

    const baseRisk =
      fraudScore * 0.3 +
      sarSeverity * 0.2 +
      behaviorScore * 0.2 +
      bankRiskScore * 0.2 +
      incomePenalty * 0.1;

    const riskScore = Math.round(Math.min(Math.max(baseRisk, 0), 100));

    let riskTier: string;
    if (riskScore < 25) riskTier = 'LOW';
    else if (riskScore < 50) riskTier = 'MEDIUM';
    else if (riskScore < 75) riskTier = 'HIGH';
    else riskTier = 'EXTREME';

    return {
      fraudScore,
      sarSeverity,
      volatilityIndex: behaviorScore,
      behaviorScore,
      bankRiskScore,
      riskScore,
      riskTier,
    };
  }
}
