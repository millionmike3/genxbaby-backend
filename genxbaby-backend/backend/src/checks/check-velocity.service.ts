import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckVelocityService {
  extract(check, owner) {
    const signals = [];

    const checks24h = owner.checks.filter(c =>
      Date.now() - new Date(c.createdAt).getTime() <= 24 * 60 * 60 * 1000
    );

    if (checks24h.length >= 5) {
      signals.push('CHECK_VELOCITY_24H');
    }

    const checks7d = owner.checks.filter(c =>
      Date.now() - new Date(c.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000
    );

    if (checks7d.length >= 15) {
      signals.push('CHECK_VELOCITY_7D');
    }

    return signals;
  }
}
