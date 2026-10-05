import { Injectable } from '@nestjs/common';
import { AiOcrService } from './ai.ocr.service';
import { AiFraudService } from './ai.fraud.service';
import { AiRiskService } from './ai.risk.service';

@Injectable()
export class AiService {
  constructor(
    private ocr: AiOcrService,
    private fraud: AiFraudService,
    private risk: AiRiskService,
  ) {}

  extractOCR(docId: string, text: string) {
    return this.ocr.extractText(docId, text);
  }

  scoreCheck(checkId: string) {
    return this.fraud.scoreCheck(checkId);
  }

  scoreDocument(docId: string) {
    return this.fraud.scoreDocument(docId);
  }

  predictOwnerRisk(ownerId: string) {
    return this.risk.predictOwnerRisk(ownerId);
  }
}
