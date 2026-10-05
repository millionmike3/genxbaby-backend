import { Injectable } from '@nestjs/common';

@Injectable()
export class UnderwritingDecisionService {
  decide(score, reasons) {
    if (score >= 80) {
      return {
        decision: 'APPROVE',
        reasons,
      };
    }

    if (score >= 55) {
      return {
        decision: 'REVIEW',
        reasons,
      };
    }

    return {
      decision: 'DECLINE',
      reasons,
    };
  }
}
