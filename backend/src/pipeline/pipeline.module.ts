import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { DocumentsModule } from '../documents/documents.module';
import { OcrModule } from '../ocr/ocr.module';
import { DocumentFraudModule } from '../fraud/document-fraud.module';
import { IncomeModule } from '../income/income.module';
import { FinancialHealthModule } from '../financial-health/financial-health.module';
import { RiskModule } from '../risk/risk.module';
import { PricingModule } from '../pricing/pricing.module';

import { PipelineService } from './pipeline.service';
import { PipelineController } from './pipeline.controller';

@Module({
  imports: [
    PrismaModule,
    DocumentsModule,
    OcrModule,
    DocumentFraudModule,
    IncomeModule,
    FinancialHealthModule,
    RiskModule,
    PricingModule,
  ],
  controllers: [PipelineController],
  providers: [PipelineService],
  exports: [PipelineService],
})
export class PipelineModule {}
