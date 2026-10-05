import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiFraudService {
  constructor(private prisma: PrismaService) {}

  async scoreCheck(checkId: string) {
    const check = await this.prisma.check.findUnique({
      where: { id: checkId },
      include: {
        signer: true,
        bankProfile: true,
        fraudFlags: true,
      },
    });

    const score =
      (check.amount > 5000 ? 20 : 0) +
      (check.fraudFlags.length * 25) +
      (check.signer?.riskScore || 0);

    return {
      checkId,
      score,
      riskLevel: score > 60 ? 'HIGH' : score > 30 ? 'MEDIUM' : 'LOW',
    };
  }

  async scoreDocument(docId: string) {
    const doc = await this.prisma.ownerDocument.findUnique({
      where: { id: docId },
      include: {
        ocrExtractions: true,
        fraudResults: true,
      },
    });

    const score =
      (doc.fraudResults.length * 30) +
      (doc.ocrExtractions.length > 1 ? 10 : 0);

    return {
      docId,
      score,
      riskLevel: score > 50 ? 'HIGH' : score > 20 ? 'MEDIUM' : 'LOW',
    };
  }
}
