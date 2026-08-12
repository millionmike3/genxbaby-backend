import { Injectable } from '@nestjs/common';

@Injectable()
export class SyntheticBehaviorService {
  detect(owner) {
    const signals = [];

    // Velocity anomaly: too many accounts
    if (owner.accounts.length >= 4) {
      signals.push('ACCOUNT_VELOCITY_ANOMALY');
    }

    // Velocity anomaly: too many checks
    if (owner.checks.length >= 10) {
      signals.push('CHECK_VELOCITY_ANOMALY');
    }

    // No historical activity
    if (owner.identityEvents.length === 0) {
      signals.push('NO_IDENTITY_HISTORY');
    }

    return signals;
  }
}
