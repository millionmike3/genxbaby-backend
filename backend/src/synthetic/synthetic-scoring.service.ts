import { Injectable } from '@nestjs/common';

@Injectable()
export class SyntheticScoringService {
  score(signals) {
    let score = 0;

    const weights = {
      THIN_IDENTITY: 20,
      MULTIPLE_ADDRESSES: 15,
      MULTIPLE_PHONES: 15,
      MISSING_DOB: 10,
      INVALID_SSN: 25,
      EMAIL_COLLISION: 20,
      PHONE_COLLISION: 20,
      ADDRESS_COLLISION: 20,
      DOCUMENT_TEMPLATE_PATTERN: 30,
      DOCUMENT_TEMPLATE_NAME: 20,
      DEVICE_SHARED_CLUSTER: 25,
      NO_DEVICE_HISTORY: 10,
      ACCOUNT_VELOCITY_ANOMALY: 15,
      CHECK_VELOCITY_ANOMALY: 15,
      NO_IDENTITY_HISTORY: 10,
    };

    signals.forEach(sig => {
      score += weights[sig] || 0;
    });

    return Math.min(score, 100);
  }
}
