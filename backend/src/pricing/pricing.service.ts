import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PricingEngine } from './pricing.engine';
import { RiskScoringEngine } from '../risk/risk-scoring.engine';

@Injectable()
export class PricingService {
  constructor(
    private prisma: PrismaService,
    private pricingEngine: PricingEngine,
    private riskEngine: RiskScoringEngine,
  ) {}

  async priceOwner(ownerId: string) {
    const risk = await this.riskEngine.computeOwnerRisk(ownerId);
    const pricing = this.pricingEngine.computePricing(risk.riskScore, risk.riskTier);

    const log = await this.prisma.pricingDecisionLog.create({
      data: {
        ownerId,
        baseRateBps: pricing.baseRateBps,
        marginBps: pricing.marginBps,
        finalRateBps: pricing.finalRateBps,
        riskScore: risk.riskScore,
        riskTier: risk.riskTier,
        fraudScore: risk.fraudScore,
        sarSeverity: risk.sarSeverity,
        volatilityIndex: risk.volatilityIndex,
        behaviorScore: risk.behaviorScore,
        bankRiskScore: risk.bankRiskScore,
      },
    });

    await this.prisma.riskHistoryLog.updateMany({
      where: { ownerId },
      data: { finalRateBps: pricing.finalRateBps },
    });

    return { risk, pricing, log };
  }

  async getPricingHistory(ownerId: string) {
    return this.prisma.pricingDecisionLog.findMany({
      where: { ownerId },
      orderBy: { timestamp: 'desc' },
    });
  }
}
