import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FinancialHealthEngine } from './financial-health.engine';

@Injectable()
export class FinancialHealthService {
  constructor(
    private prisma: PrismaService,
    private engine: FinancialHealthEngine,
  ) {}

  async compute(docId: string, ownerId: string) {
    const ocr = await this.prisma.oCRExtraction.findMany({
      where: { docId },
    });

    const text = ocr.map(o => o.text).join(' ');

    const result = this.engine.compute(text);

    return this.prisma.financialHealthSnapshot.create({
      data: {
        ownerId,
        ...result,
      },
    });
  }
}
