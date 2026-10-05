import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IncomeEngine } from './income.engine';

@Injectable()
export class IncomeService {
  constructor(
    private prisma: PrismaService,
    private engine: IncomeEngine,
  ) {}

  async verify(docId: string, ownerId: string) {
    const ocr = await this.prisma.oCRExtraction.findMany({
      where: { docId },
    });

    const text = ocr.map(o => o.text).join(' ');

    const result = this.engine.computeFromText(text);

    return this.prisma.incomeVerificationSnapshot.create({
      data: {
        ownerId,
        ...result,
      },
    });
  }
}
