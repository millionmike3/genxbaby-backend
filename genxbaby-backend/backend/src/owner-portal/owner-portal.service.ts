import { Injectable } from '@nestjs/common';

import { OwnerService } from '../owner/owner.service';
import { UserService } from '../user/user.service';
import { BankService } from '../bank/bank.service';
import { CheckService } from '../check/check.service';
import { DocumentsService } from '../documents/documents.service';
import { OcrService } from '../ocr/ocr.service';
import { DocumentFraudService } from '../fraud/document-fraud.service';
import { IncomeService } from '../income/income.service';
import { FinancialHealthService } from '../financial-health/financial-health.service';
import { RiskService } from '../risk/risk.service';
import { PricingService } from '../pricing/pricing.service';

@Injectable()
export class OwnerPortalService {
  constructor(
    private owners: OwnerService,
    private users: UserService,
    private banks: BankService,
    private checks: CheckService,
    private documents: DocumentsService,
    private ocr: OcrService,
    private fraud: DocumentFraudService,
    private income: IncomeService,
    private health: FinancialHealthService,
    private risk: RiskService,
    private pricing: PricingService,
  ) {}

  async getOwnerOverview(ownerId: string) {
    const [owner, users, bankProfiles, riskHistory, pricingHistory] =
      await Promise.all([
        this.owners.findOne(ownerId),
        this.users.findAllByOwner(ownerId),
        this.banks.listBankProfiles(ownerId),
        this.risk.getHistory(ownerId),
        this.pricing.getPricingHistory(ownerId),
      ]);

    return {
      owner,
      users,
      bankProfiles,
      riskHistory,
      pricingHistory,
    };
  }

  async getDocuments(ownerId: string) {
    return this.documents.listByOwner(ownerId);
  }

  async getDocumentDetails(docId: string) {
    const doc = await this.documents.get(docId);

    return {
      document: doc,
      ocr: doc.ocrExtractions,
      fraud: doc.fraudResults,
    };
  }

  async getChecks(ownerId: string) {
    const bankProfiles = await this.banks.listBankProfiles(ownerId);

    const checks = [];
    for (const bank of bankProfiles) {
      const list = await this.checks.listByBankProfile(bank.id);
      checks.push(...list);
    }

    return checks;
  }

  async getFinancialHealth(ownerId: string) {
    return this.health.getLatest(ownerId);
  }

  async getIncomeVerification(ownerId: string) {
    return this.income.getLatest(ownerId);
  }

  async getRisk(ownerId: string) {
    return this.risk.getHistory(ownerId);
  }

  async getPricing(ownerId: string) {
    return this.pricing.getPricingHistory(ownerId);
  }
}
