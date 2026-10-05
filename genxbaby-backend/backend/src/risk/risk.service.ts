import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RiskScoringEngine } from './risk-scoring.engine';

@Injectable()
export class RiskService {
  constructor(
    private prisma: PrismaService,
    private engine: RiskScoringEngine,
  ) {}

  async computeAndLogRisk(ownerId: string) {
    const result = await this.engine.computeOwnerRisk(ownerId);

    const log = await this.prisma.riskHistoryLog.create({
      data: {
        ownerId,
        fraudScore: result.fraudScore,
        sarSeverity: result.sarSeverity,
        volatilityIndex: result.volatilityIndex,
        behaviorScore: result.behaviorScore,
        bankRiskScore: result.bankRiskScore,
        riskScore: result.riskScore,
        riskTier: result.riskTier,
        finalRateBps: 0, // filled by pricing engine
      },
    });

    return { result, log };
  }

  async getHistory(ownerId: string) {
    return this.prisma.riskHistoryLog.findMany({
      where: { ownerId },
      orderBy: { timestamp: 'desc' },
    });
  }
}
