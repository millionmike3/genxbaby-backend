import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { AuditService } from '../audit/audit.service';
import { AiOcrService } from '../ai/ai.ocr.service';
import { AiFraudService } from '../ai/ai.fraud.service';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private aiOcr: AiOcrService,
    private aiFraud: AiFraudService,
    private alerts: AlertsService,   // ⭐ REQUIRED FOR HIGH-RISK ALERTS
  ) {}

  /**
   * Upload a new document + AI fraud scoring
   */
  async upload(dto: UploadDocumentDto, userId: string) {
    const doc = await this.prisma.ownerDocument.create({
      data: {
        ownerId: dto.ownerId,
        fileName: dto.fileName,
        filePath: dto.filePath,
        mimeType: dto.mimeType,
        status: 'PENDING',
      },
    });

    await this.audit.log('DOCUMENT_UPLOADED', userId, { docId: doc.id });
    await this.addTimelineEvent(dto.ownerId, doc.id, 'DOCUMENT_UPLOADED');

    return doc;
  }

  /**
   * Extract OCR text using AI + store results + timeline + audit
   */
  async extractOCR(docId: string, text: string, userId: string) {
    const doc = await this.prisma.ownerDocument.findUnique({ where: { id: docId } });
    if (!doc) throw new NotFoundException('Document not found');

    // AI OCR extraction
    const extraction = await this.aiOcr.extractText(docId, text);

    await this.audit.log('DOCUMENT_OCR_EXTRACTED', userId, { docId });
    await this.addTimelineEvent(doc.ownerId, docId, 'DOCUMENT_OCR_EXTRACTED');

    return extraction;
  }

  /**
   * AI fraud scoring + store insights + timeline + audit + alerts
   */
  async addFraudResult(docId: string, result: string, userId: string) {
    const doc = await this.prisma.ownerDocument.findUnique({ where: { id: docId } });
    if (!doc) throw new NotFoundException('Document not found');

    // Store manual fraud result
    const fraud = await this.prisma.documentFraudResult.create({
      data: {
        docId,
        result,
      },
    });

    // AI fraud scoring
    const aiScore = await this.aiFraud.scoreDocument(docId);

    // Store AI insights
    await this.prisma.aiDocumentInsight.create({
      data: {
        docId,
        score: aiScore.score,
        riskLevel: aiScore.riskLevel,
      },
    });

    // ⭐ HIGH-RISK ALERT TRIGGER
    if (aiScore.riskLevel === 'HIGH') {
      await this.alerts.createAlert(
        doc.ownerId,
        'DOCUMENT_HIGH_RISK',
        'HIGH',
        { docId, aiScore },
        userId,
      );
    }

    await this.audit.log('DOCUMENT_FRAUD_RESULT', userId, {
      docId,
      result,
      aiScore,
    });

    await this.addTimelineEvent(doc.ownerId, docId, 'DOCUMENT_FRAUD_AI_SCORED');

    return { fraud, aiScore };
  }

  /**
   * Update document status (PENDING → VERIFIED → FLAGGED → REJECTED)
   */
  async updateStatus(docId: string, status: string, userId: string) {
    const doc = await this.prisma.ownerDocument.findUnique({ where: { id: docId } });
    if (!doc) throw new NotFoundException('Document not found');

    const updated = await this.prisma.ownerDocument.update({
      where: { id: docId },
      data: { status },
    });

    await this.audit.log('DOCUMENT_STATUS_UPDATED', userId, { docId, status });
    await this.addTimelineEvent(doc.ownerId, docId, `DOCUMENT_${status}`);

    return updated;
  }

  /**
   * Get document with OCR, fraud results, AI insights
   */
  async get(docId: string) {
    return this.prisma.ownerDocument.findUnique({
      where: { id: docId },
      include: {
        ocrExtractions: true,
        fraudResults: true,
        aiInsights: true,
      },
    });
  }

  /**
   * Timeline helper
   */
  async addTimelineEvent(ownerId: string, docId: string, event: string) {
    return this.prisma.timelineEvent.create({
      data: {
        ownerId,
        docId,
        event,
        timestamp: new Date(),
      },
    });
  }
}
