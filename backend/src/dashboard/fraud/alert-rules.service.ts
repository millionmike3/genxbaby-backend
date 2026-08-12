import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertRulesService {
  evaluate(owner) {
    const alerts = [];

    // Rule 1 — Multiple SAR reports
    if (owner.sarReports.length >= 2) {
      alerts.push({
        type: 'MULTIPLE_SAR',
        severity: 'CRITICAL',
        message: 'Owner has multiple SAR reports.',
      });
    }

    // Rule 2 — High fraud score
    if (owner.riskScore >= 80) {
      alerts.push({
        type: 'HIGH_FRAUD_SCORE',
        severity: 'HIGH',
        message: `Fraud score is ${owner.riskScore}.`,
      });
    }

    // Rule 3 — Device anomaly
    if (owner.devices.length >= 4) {
      alerts.push({
        type: 'DEVICE_ANOMALY',
        severity: 'MEDIUM',
        message: 'Owner has multiple devices linked.',
      });
    }

    // Rule 4 — Routing cluster
    if (owner.accounts.length >= 2) {
      const routingNumbers = owner.accounts.map(a => a.routingNumber);
      const unique = new Set(routingNumbers);
      if (unique.size < routingNumbers.length) {
        alerts.push({
          type: 'ROUTING_CLUSTER',
          severity: 'HIGH',
          message: 'Owner shares routing numbers with other accounts.',
        });
      }
    }

    // Rule 5 — Document fraud
    const docFraudScores = owner.documents.flatMap(d => d.fraudResults.map(r => r.fraudScore));
    const maxDocFraud = Math.max(...docFraudScores, 0);

    if (maxDocFraud >= 70) {
      alerts.push({
        type: 'DOCUMENT_FRAUD',
        severity: 'HIGH',
        message: 'Document fraud score exceeds threshold.',
      });
    }

    return alerts;
  }
}
