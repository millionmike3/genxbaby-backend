import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { runGenericOCR, cleanOCRText } from '../../services/ocrService';

@Injectable()
export class OcrService {
  constructor(private prisma: PrismaService) {}

  async extract(docId: string, filePath: string) {
    const raw = await runGenericOCR(filePath);
    const text = cleanOCRText(raw);

    return this.prisma.oCRExtraction.create({
      data: {
        docId,
        text,
      },
    });
  }
}
