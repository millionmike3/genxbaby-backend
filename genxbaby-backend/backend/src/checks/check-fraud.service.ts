import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckFraudService {
  extract(check) {
    const signals = [];

    if (check.fraudFlags.length >= 1) {
      signals.push('CHECK_HAS_FRAUD_FLAGS');
    }

    if (check.fraudFlags.some(f => f.type === 'WASHED')) {
      signals.push('CHECK_WASHED');
    }

    if (check.fraudFlags.some(f => f.type === 'COUNTERFEIT')) {
      signals.push('CHECK_COUNTERFEIT');
    }

    if (check.fraudFlags.some(f => f.type === 'ALTERED')) {
      signals.push('CHECK_ALTERED');
    }

    return signals;
  }
}
