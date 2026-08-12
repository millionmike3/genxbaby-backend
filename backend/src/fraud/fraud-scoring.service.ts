import { Injectable } from '@nestjs/common';

@Injectable()
export class FraudScoringService {
  computeScore(graph) {
    let score = 0;
    const issues = [];

    const owner = graph.owner;

    // Fraud flags
    score += owner.fraudFlags.length * 15;
    if (owner.fraudFlags.length > 3) issues.push('MULTIPLE_FRAUD_FLAGS');

    // SAR reports
    score += owner.sarReports.length * 25;
    if (owner.sarReports.length > 1) issues.push('MULTIPLE_SAR_REPORTS');

    // Device anomalies
    if (owner.devices.length > 3) {
      score += 20;
      issues.push('MULTIPLE_DEVICES');
    }

    // Document fraud
    const docFraudScores = owner.documents.flatMap(d => d.fraudResults.map(r => r.fraudScore));
    const avgDocFraud = docFraudScores.length ? docFraudScores.reduce((a,b)=>a+b)/docFraudScores.length : 0;

    score += avgDocFraud * 0.3;

    // Check fraud
    const checkFlags = owner.checks.flatMap(c => c.fraudFlags);
    score += checkFlags.length * 10;

    return {
      score: Math.round(score),
      issues,
    };
  }
}
