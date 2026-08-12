import { Injectable } from '@nestjs/common';

@Injectable()
export class PricingEngine {
  computePricing(riskScore: number, riskTier: string) {
    const baseRateBps = 500; // 5.00%

    let marginBps = 0;
    switch (riskTier) {
      case 'LOW':
        marginBps = 50;
        break;
      case 'MEDIUM':
        marginBps = 150;
        break;
      case 'HIGH':
        marginBps = 300;
        break;
      case 'EXTREME':
        marginBps = 500;
        break;
    }

    marginBps += Math.round(riskScore * 2);

    const finalRateBps = baseRateBps + marginBps;

    return {
      baseRateBps,
      marginBps,
      finalRateBps,
    };
  }
}
