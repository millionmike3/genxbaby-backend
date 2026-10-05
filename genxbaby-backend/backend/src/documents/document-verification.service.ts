import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OCRService } from './ocr.service';
import { DocumentParserService } from './document-parser.service';
import { DocumentAuthenticityService } from './document-authenticity.service';
import { DocumentFraudService } from './document-fraud.service';
import { DocumentConsistencyService } from './document-consistency.service';

@Injectable()
export class DocumentVerificationService {
  constructor(
    private prisma: PrismaService,
    private ocr: OCRService,
    private parser: DocumentParserService,
    private authenticity: DocumentAuthenticityService,
    private fraud: DocumentFraudService,
    private consistency: DocumentConsistencyService,
  ) {}

  async verifyDocument(docId: string, rawText: string) {
    const doc = await this.prisma.ownerDocument.findUnique({
      where: { id: docId },
    });

    // 1. OCR Extraction
    const ocrRecord = await this.ocr.extractText(docId, rawText);

    // 2. Parse fields
    const fields = this.parser.extractFields(rawText);

    // 3. Authenticity
    const auth = this.authenticity.computeAuthenticity(rawText, fields);

    // 4. Cross-document consistency
    const consistency = await this.consistency.computeConsistency(doc.ownerId, fields);

    // 5. Fraud score
    const fraudScore = Math.round(
      (auth.authenticityScore * 0.5) +
      (consistency.consistencyScore * 0.5)
    );

    // 6. Store fraud result
    await this.fraud.storeFraudResult(docId, fraudScore, [
      ...auth.issues,
      ...consistency.issues,
    ]);

    return {
      fields,
      authenticity: auth,
      consistency,
      fraudScore,
    };
  }
}
