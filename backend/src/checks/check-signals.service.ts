import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckSignalsService {
  extract(check) {
    const signals = [];

    if (!check.amount || check.amount <= 0) {
      signals.push('INVALID_AMOUNT');
    }

    if (!check.checkNumber) {
      signals.push('MISSING_CHECK_NUMBER');
    }

    if (check.amount >= 5000) {
      signals.push('HIGH_VALUE_CHECK');
    }

    if (check.memo && check.memo.toLowerCase().includes('loan')) {
      signals.push('LOAN_RELATED_CHECK');
    }

    return signals;
  }
}
