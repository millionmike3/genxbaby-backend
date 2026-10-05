import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckSyntheticService {
  extract(check, ownerSyntheticScore) {
    const signals = [];

    if (ownerSyntheticScore >= 60) {
      signals.push('OWNER_SYNTHETIC_RISK');
    }

    if (!check.routingNumber || check.routingNumber.length !== 9) {
      signals.push('INVALID_ROUTING_NUMBER');
    }

    if (!check.accountNumber || check.accountNumber.length < 6) {
      signals.push('INVALID_ACCOUNT_NUMBER');
    }

    return signals;
  }
}
