import { Injectable } from '@nestjs/common';
import { DocumentsService } from '../documents/documents.service';
import { OcrService } from '../ocr/ocr.service';
import { DocumentFraudService } from '../fraud/document-fraud.service';
import { IncomeService } from '../income/income.service';
import { FinancialHealthService } from '../financial-health/financial-health.service';
import { RiskService } from '../risk/risk.service';
import { PricingService } from '../pricing/pricing.service';

@Injectable()
export class PipelineService {
  constructor(
    private documents: DocumentsService,
    private ocr: OcrService,
    private fraud: DocumentFraudService,
    private income: IncomeService,
    private health: FinancialHealthService,
    private risk: RiskService,
    private pricing: PricingService,
  ) {}

  async runFullPipeline(docId: string, ownerId: string, filePath: string) {
    const steps: any = {};

    // 1. OCR Extraction
    steps.ocr = await this.ocr.extract(docId, filePath);

    // 2. Document Fraud Analysis
    steps.fraud = await this.fraud.analyze(docId);

    // 3. Income Verification
    steps.income = await this.income.verify(docId, ownerId);

    // 4. Financial Health
    steps.health = await this.health.compute(docId, ownerId);

    // 5. Risk Scoring + Logging
    steps.risk = await this.risk.computeAndLogRisk(ownerId);

    // 6. Pricing Decision + Logging
    steps.pricing = await this.pricing.priceOwner(ownerId);

    // 7. Mark document as VERIFIED
    await this.documents.updateStatus(docId, 'VERIFIED');

    return {
      message: 'Pipeline completed successfully',
      steps,
    };
  }
}
