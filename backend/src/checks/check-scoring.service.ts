import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckScoringService {
  score(signals) {
    const weights = {
      INVALID_AMOUNT: 20,
      MISSING_CHECK_NUMBER: 10,
      HIGH_VALUE_CHECK: 15,
      LOAN_RELATED_CHECK: 5,

      CHECK_HAS_FRAUD_FLAGS: 25,
      CHECK_WASHED: 40,
      CHECK_COUNTERFEIT: 50,
      CHECK_ALTERED: 35,

      OWNER_SYNTHETIC_RISK: 30,
      INVALID_ROUTING_NUMBER: 20,
      INVALID_ACCOUNT_NUMBER: 20,

      CHECK_VELOCITY_24H: 30,
      CHECK_VELOCITY_7D: 20,
    };

    let score = 0;

    signals.forEach(sig => {
      score += weights[sig] || 0;
    });

    return Math.min(score, 100);
  }
}
