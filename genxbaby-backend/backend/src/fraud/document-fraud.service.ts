import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentFraudService {
  constructor(private prisma: PrismaService) {}

  async analyze(docId: string) {
    const ocr = await this.prisma.oCRExtraction.findMany({
      where: { docId },
    });

    const text = ocr.map(o => o.text).join(' ');

    const issues = [];

    if (text.includes('template') || text.includes('sample')) {
      issues.push('Document appears to be a template or sample.');
    }

    if (text.match(/gross\s+pay/i) && !text.match(/net\s+pay/i)) {
      issues.push('Missing net pay field.');
    }

    if (text.match(/account\s+number/i) && text.match(/xxxx/i)) {
      issues.push('Masked account number — possible tampering.');
    }

    const fraudScore = Math.min(issues.length * 20, 100);

    return this.prisma.documentFraudResult.create({
      data: {
        docId,
        fraudScore,
        issues,
      },
    });
  }
}
