import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiOcrService {
  constructor(private prisma: PrismaService) {}

  async extractText(docId: string, rawText: string) {
    return this.prisma.oCRExtraction.create({
      data: {
        docId,
        text: rawText,
      },
    });
  }
}
