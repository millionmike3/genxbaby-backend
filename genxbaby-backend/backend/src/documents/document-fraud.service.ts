import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentFraudService {
  constructor(private prisma: PrismaService) {}

  async storeFraudResult(docId: string, fraudScore: number, issues: string[]) {
    return this.prisma.documentFraudResult.create({
      data: {
        docId,
        fraudScore,
        issues,
      },
    });
  }
}
