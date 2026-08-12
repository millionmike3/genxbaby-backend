import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CaseAttachmentsService {
  constructor(private prisma: PrismaService) {}

  async attach(caseId: string, type: string, refId: string) {
    return this.prisma.caseAttachment.create({
      data: {
        caseId,
        type,
        refId,
      },
    });
  }

  async getAttachments(caseId: string) {
    return this.prisma.caseAttachment.findMany({
      where: { caseId },
    });
  }
}
