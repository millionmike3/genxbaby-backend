import { Injectable } from '@nestjs/common';

@Injectable()
export class IncomeEngine {
  computeFromText(text: string) {
    const gross = this.extractNumber(text, /gross\s+pay[:\s]+([\d,.]+)/i);
    const net = this.extractNumber(text, /net\s+pay[:\s]+([\d,.]+)/i);

    const employerMatch = text.includes('Employer') ? 90 : 40;
    const bankMatch = text.includes('Deposit') ? 80 : 30;

    const stability = gross && net ? 90 : 40;

    return {
      grossMonthlyIncome: gross || 0,
      netMonthlyIncome: net || 0,
      incomeStability: stability,
      employerMatch,
      bankMatch,
      incomeVerificationScore: Math.round((stability + employerMatch + bankMatch) / 3),
    };
  }

  private extractNumber(text: string, regex: RegExp) {
    const match = text.match(regex);
    if (!match) return null;
    return parseFloat(match[1].replace(/,/g, ''));
  }
}
