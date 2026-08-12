import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckDecisionService {
  decide(score, signals) {
    if (score >= 80) {
      return { decision: 'DECLINE', signals };
    }

    if (score >= 50) {
      return { decision: 'REVIEW', signals };
    }

    return { decision: 'APPROVE', signals };
  }
}
