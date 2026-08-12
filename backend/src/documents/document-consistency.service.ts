import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentConsistencyService {
  constructor(private prisma: PrismaService) {}

  async computeConsistency(ownerId: string, fields: any) {
    const owner = await this.prisma.owner.findUnique({
      where: { id: ownerId },
      include: {
        accounts: true,
        devices: true,
        documents: {
          include: { ocrExtractions: true },
        },
      },
    });

    let score = 100;
    const issues = [];

    // Name consistency
    if (owner.fullName && fields.name && owner.fullName !== fields.name) {
      issues.push('NAME_MISMATCH');
      score -= 20;
    }

    // Routing consistency
    const routingNumbers = owner.accounts.map(a => a.routingNumber);
    if (fields.routingNumber && !routingNumbers.includes(fields.routingNumber)) {
      issues.push('ROUTING_MISMATCH');
      score -= 20;
    }

    return {
      consistencyScore: Math.max(score, 0),
      issues,
    };
  }
}
