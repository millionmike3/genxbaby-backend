import { Injectable } from '@nestjs/common';

@Injectable()
export class SyntheticDocumentsService {
  detect(owner) {
    const signals = [];

    owner.documents.forEach(doc => {
      const fraudScores = doc.fraudResults.map(r => r.fraudScore);
      const maxScore = Math.max(...fraudScores, 0);

      if (maxScore >= 80) {
        signals.push('DOCUMENT_TEMPLATE_PATTERN');
      }

      if (doc.fileName.toLowerCase().includes('template')) {
        signals.push('DOCUMENT_TEMPLATE_NAME');
      }
    });

    return signals;
  }
}
