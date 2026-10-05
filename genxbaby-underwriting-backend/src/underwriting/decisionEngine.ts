// src/underwriting/decisionEngine.ts

import { verifyIncome } from "./incomeVerification";
import { calculateLTV } from "./ltvCalculator";
import { calculateDTI } from "./dtiCalculator";
import { detectFraud } from "./fraudSignals";
import { mapRiskTier } from "./riskTier";
import { pricingForTier } from "./pricingModel";

/**
 * Run the full underwriting decision pipeline.
 * @param application - Loan application data
 * @param borrower - Borrower data
 * @returns underwriting decision result
 */
export function runUnderwriting(application: any, borrower: any) {
  // Step 1: Income verification
  const income = verifyIncome(application.incomeAmount, application.incomeYears);

  // Step 2: Loan-to-value ratio
  const ltv = calculateLTV(application.amount, application.propertyValue);

  // Step 3: Debt-to-income ratio
  const dti = calculateDTI(application.monthlyDebt || 0, application.incomeAmount / 12);

  // Step 4: Fraud detection
  const fraud = detectFraud(application, borrower);

  // Step 5: Risk score calculation
  let score =
    income.combined * 400 +
    (1 - ltv) * 300 +
    (1 - dti) * 300 -
    fraud.riskPenalty;

  // Clamp score between 0 and 1000
  score = Math.max(0, Math.min(score, 1000));

  // Step 6: Map to risk tier
  const tier = mapRiskTier(score);

  // Step 7: Pricing model consumption
  const rate = pricingForTier(tier);

  // Step 8: Decision outcome
  const decision =
    tier === "HIGH_RISK" ? "DECLINED" :
    tier === "D" ? "NEEDS_MORE_INFO" :
    "APPROVED";

  return {
    score,
    tier,
    rate,
    decision,
    fraudSignals: fraud.signals
  };
}
