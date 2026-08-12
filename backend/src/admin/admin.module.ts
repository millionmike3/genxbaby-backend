import { Module } from '@nestjs/common';

import { OwnerModule } from '../owner/owner.module';
import { UserModule } from '../user/user.module';
import { RbacModule } from '../rbac/rbac.module';
import { BankModule } from '../bank/bank.module';
import { CheckModule } from '../check/check.module';
import { DocumentsModule } from '../documents/documents.module';
import { OcrModule } from '../ocr/ocr.module';
import { DocumentFraudModule } from '../fraud/document-fraud.module';
import { IncomeModule } from '../income/income.module';
import { FinancialHealthModule } from '../financial-health/financial-health.module';
import { RiskModule } from '../risk/risk.module';
import { PricingModule } from '../pricing/pricing.module';
import { PipelineModule } from '../pipeline/pipeline.module';

import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    OwnerModule,
    UserModule,
    RbacModule,
    BankModule,
    CheckModule,
    DocumentsModule,
    OcrModule,
    DocumentFraudModule,
    IncomeModule,
    FinancialHealthModule,
    RiskModule,
    PricingModule,
    PipelineModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
