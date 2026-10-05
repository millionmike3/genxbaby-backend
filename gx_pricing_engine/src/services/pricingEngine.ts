import { computeLLPAForLoan } from "./llpaEngine";
import { LoanPricingInput } from "./types";

export async function priceLoan(
  loan: LoanPricingInput,
  ownerConfig: {
    target_profit_bps: number;
    risk_premium_bps: number;
    min_margin_bps: number;
    max_margin_bps: number;
  },
  baseRateBps: number
) {
  const llpaBps = await computeLLPAForLoan(loan);

  const marginBps = Math.min(
    Math.max(ownerConfig.target_profit_bps + ownerConfig.risk_premium_bps, ownerConfig.min_margin_bps),
    ownerConfig.max_margin_bps
  );

  const finalRateBps = baseRateBps + llpaBps + marginBps;

  return {
    baseRateBps,
    llpaBps,
    marginBps,
    finalRateBps,
    finalRatePercent: finalRateBps / 100,
  };
}
