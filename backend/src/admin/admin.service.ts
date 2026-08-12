import { Injectable } from '@nestjs/common';

import { OwnerService } from '../owner/owner.service';
import { UserService } from '../user/user.service';
import { RoleService } from '../rbac/role.service';
import { PermissionService } from '../rbac/permission.service';
import { BankService } from '../bank/bank.service';
import { CheckService } from '../check/check.service';
import { DocumentsService } from '../documents/documents.service';
import { OcrService } from '../ocr/ocr.service';
import { DocumentFraudService } from '../fraud/document-fraud.service';
import { IncomeService } from '../income/income.service';
import { FinancialHealthService } from '../financial-health/financial-health.service';
import { RiskService } from '../risk/risk.service';
import { PricingService } from '../pricing/pricing.service';
import { PipelineService } from '../pipeline/pipeline.service';

@Injectable()
export class AdminService {
  constructor(
    private owners: OwnerService,
    private users: UserService,
    private roles: RoleService,
    private permissions: PermissionService,
    private banks: BankService,
    private checks: CheckService,
    private documents: DocumentsService,
    private ocr: OcrService,
    private fraud: DocumentFraudService,
    private income: IncomeService,
    private health: FinancialHealthService,
    private risk: RiskService,
    private pricing: PricingService,
    private pipeline: PipelineService,
  ) {}

  async getOwnerDashboard(ownerId: string) {
    const [owner, users, roles, bankProfiles, riskHistory, pricingHistory] =
      await Promise.all([
        this.owners.findOne(ownerId),
        this.users.findAllByOwner(ownerId),
        this.roles.findAll(ownerId),
        this.banks.listBankProfiles(ownerId),
        this.risk.getHistory(ownerId),
        this.pricing.getPricingHistory(ownerId),
      ]);

    return {
      owner,
      users,
      roles,
      bankProfiles,
      riskHistory,
      pricingHistory,
    };
  }

  async getDocumentDashboard(docId: string) {
    const doc = await this.documents.get(docId);

    return {
      document: doc,
      ocr: doc.ocrExtractions,
      fraud: doc.fraudResults,
    };
  }

  async runPipeline(docId: string, ownerId: string, filePath: string) {
    return this.pipeline.runFullPipeline(docId, ownerId, filePath);
  }
}
