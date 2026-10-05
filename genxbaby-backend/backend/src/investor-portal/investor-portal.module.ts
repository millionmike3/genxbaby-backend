import { Module } from '@nestjs/common';

import { OwnerModule } from '../owner/owner.module';
import { RiskModule } from '../risk/risk.module';
import { PricingModule } from '../pricing/pricing.module';
import { FinancialHealthModule } from '../financial-health/financial-health.module';
import { IncomeModule } from '../income/income.module';
import { BankModule } from '../bank/bank.module';
import { CheckModule } from '../check/check.module';
import { DocumentsModule } from '../documents/documents.module';
import { FraudModule } from '../fraud/document-fraud.module';

import { InvestorPortalService } from './investor-portal.service';
import { InvestorPortalController } from './investor-portal.controller';

@Module({
  imports: [
    OwnerModule,
    RiskModule,
    PricingModule,
    FinancialHealthModule,
    IncomeModule,
    BankModule,
    CheckModule,
    DocumentsModule,
    FraudModule,
  ],
  controllers: [InvestorPortalController],
  providers: [InvestorPortalService],
})
export class InvestorPortalModule {}
