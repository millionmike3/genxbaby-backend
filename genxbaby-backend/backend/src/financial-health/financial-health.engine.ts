import { Injectable } from '@nestjs/common';

@Injectable()
export class FinancialHealthEngine {
  compute(text: string) {
    const liquidity = text.includes('Ending Balance')
      ? 80
      : 40;

    const cashflow = text.match(/deposit/i)
      ? 85
      : 50;

    const overdraftRisk = text.match(/overdraft/i)
      ? 70
      : 20;

    const financialHealthScore = Math.round(
      (liquidity + cashflow + (100 - overdraftRisk)) / 3,
    );

    return {
      liquidityScore: liquidity,
      incomeStability: cashflow,
      debtLoadScore: 100 - overdraftRisk,
      cashFlowScore: cashflow,
      overdraftRisk,
      financialHealthScore,
    };
  }
}
