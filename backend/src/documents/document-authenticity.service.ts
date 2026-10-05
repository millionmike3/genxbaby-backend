import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentAuthenticityService {
  computeAuthenticity(text: string, fields: any) {
    const issues = [];
    let score = 100;

    if (text.length < 40) {
      issues.push('DOCUMENT_TOO_SHORT');
      score -= 20;
    }

    if (text.includes('VOID')) {
      issues.push('VOID_MARK');
      score -= 25;
    }

    if (text.includes('SAMPLE')) {
      issues.push('SAMPLE_WATERMARK');
      score -= 20;
    }

    if (Object.values(fields).filter(v => !v).length > 2) {
      issues.push('MISSING_FIELDS');
      score -= 15;
    }

    return {
      authenticityScore: Math.max(score, 0),
      issues,
    };
  }
}
