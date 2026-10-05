import { Module } from '@nestjs/common';

import { OwnerModule } from '../owner/owner.module';
import { UserModule } from '../user/user.module';
import { BankModule } from '../bank/bank.module';
import { CheckModule } from '../check/check.module';
import { DocumentsModule } from '../documents/documents.module';
import { OcrModule } from '../ocr/ocr.module';
import { DocumentFraudModule } from '../fraud/document-fraud.module';
import { IncomeModule } from '../income/income.module';
import { FinancialHealthModule } from '../financial-health/financial-health.module';
import { RiskModule } from '../risk/risk.module';
import { PricingModule } from '../pricing/pricing.module';

import { OwnerPortalService } from './owner-portal.service';
import { OwnerPortalController } from './owner-portal.controller';

@Module({
  imports: [
    OwnerModule,
    UserModule,
    BankModule,
    CheckModule,
    DocumentsModule,
    OcrModule,
    DocumentFraudModule,
    IncomeModule,
    FinancialHealthModule,
    RiskModule,
    PricingModule,
  ],
  controllers: [OwnerPortalController],
  providers: [OwnerPortalService],
})
export class OwnerPortalModule {}
