import { Injectable } from '@nestjs/common';

@Injectable()
export class UnderwritingScoringService {
  computeScore(inputs) {
    const {
      identityRisk,
      fraudScore,
      syntheticScore,
      incomeScore,
      documentScore,
      behaviorScore,
    } = inputs;

    let score = 0;
    const reasons = [];

    // Identity risk (R2)
    score += (100 - identityRisk) * 0.20;
    if (identityRisk > 60) reasons.push('HIGH_IDENTITY_RISK');

    // Fraud score (R4)
    score += (100 - fraudScore) * 0.25;
    if (fraudScore > 70) reasons.push('HIGH_FRAUD_SCORE');

    // Synthetic identity score (R8)
    score += (100 - syntheticScore) * 0.20;
    if (syntheticScore > 50) reasons.push('SYNTHETIC_IDENTITY_RISK');

    // Income stability (from IncomeVerificationSnapshot)
    score += incomeScore * 0.20;
    if (incomeScore < 40) reasons.push('LOW_INCOME_STABILITY');

    // Document authenticity (R3)
    score += documentScore * 0.10;
    if (documentScore < 50) reasons.push('DOCUMENT_AUTHENTICITY_RISK');

    // Behavioral risk (velocity, anomalies)
    score += (100 - behaviorScore) * 0.05;
    if (behaviorScore > 60) reasons.push('BEHAVIORAL_RISK');

    return {
      score: Math.round(score),
      reasons,
    };
  }
}
