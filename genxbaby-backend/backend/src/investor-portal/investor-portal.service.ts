import { Injectable } from '@nestjs/common';

import { OwnerService } from '../owner/owner.service';
import { RiskService } from '../risk/risk.service';
import { PricingService } from '../pricing/pricing.service';
import { FinancialHealthService } from '../financial-health/financial-health.service';
import { IncomeService } from '../income/income.service';
import { BankService } from '../bank/bank.service';
import { CheckService } from '../check/check.service';
import { DocumentsService } from '../documents/documents.service';
import { DocumentFraudService } from '../fraud/document-fraud.service';

@Injectable()
export class InvestorPortalService {
  constructor(
    private owners: OwnerService,
    private risk: RiskService,
    private pricing: PricingService,
    private health: FinancialHealthService,
    private income: IncomeService,
    private banks: BankService,
    private checks: CheckService,
    private documents: DocumentsService,
    private fraud: DocumentFraudService,
  ) {}

  async getPortfolioOverview() {
    const owners = await this.owners.findAll();

    const portfolio = [];

    for (const owner of owners) {
      const [riskHistory, pricingHistory, healthSnapshot, incomeSnapshot] =
        await Promise.all([
          this.risk.getHistory(owner.id),
          this.pricing.getPricingHistory(owner.id),
          this.health.getLatest(owner.id),
          this.income.getLatest(owner.id),
        ]);

      portfolio.push({
        owner,
        latestRisk: riskHistory[0] || null,
        latestPricing: pricingHistory[0] || null,
        financialHealth: healthSnapshot || null,
        incomeVerification: incomeSnapshot || null,
      });
    }

    return {
      totalOwners: owners.length,
      portfolio,
    };
  }

  async getOwnerAnalytics(ownerId: string) {
    const [owner, riskHistory, pricingHistory, healthSnapshot, incomeSnapshot] =
      await Promise.all([
        this.owners.findOne(ownerId),
        this.risk.getHistory(ownerId),
        this.pricing.getPricingHistory(ownerId),
        this.health.getLatest(ownerId),
        this.income.getLatest(ownerId),
      ]);

    return {
      owner,
      riskHistory,
      pricingHistory,
      financialHealth: healthSnapshot,
      incomeVerification: incomeSnapshot,
    };
  }

  async getPortfolioRiskCurve() {
    const owners = await this.owners.findAll();

    const curve = [];

    for (const owner of owners) {
      const riskHistory = await this.risk.getHistory(owner.id);
      if (riskHistory.length > 0) {
        curve.push({
          ownerId: owner.id,
          ownerName: owner.name,
          riskScore: riskHistory[0].riskScore,
          riskTier: riskHistory[0].riskTier,
        });
      }
    }

    return curve;
  }

  async getPortfolioYieldCurve() {
    const owners = await this.owners.findAll();

    const curve = [];

    for (const owner of owners) {
      const pricingHistory = await this.pricing.getPricingHistory(owner.id);
      if (pricingHistory.length > 0) {
        curve.push({
          ownerId: owner.id,
          ownerName: owner.name,
          finalRateBps: pricingHistory[0].finalRateBps,
        });
      }
    }

    return curve;
  }
}
