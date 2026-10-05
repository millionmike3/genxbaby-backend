// gx_pricing_engine/src/services/riskScoreService.js

/**
 * Compute unified risk score (0–100).
 * Combines all risk signals into a single weighted score.
 *
 * Signals expected:
 * - fraudScore
 * - sarSeverity
 * - volatilityIndex
 * - behaviorScore
 * - bankRiskScore
 * - incomeVerificationScore (NEW)
 */

function computeRiskScore(signals) {
  const {
    fraudScore = 0,
    sarSeverity = 0,
    volatilityIndex = 0,
    behaviorScore = 0,
    bankRiskScore = 0,
    incomeVerificationScore = null, // NEW
  } = signals;

  // -----------------------------
  // 1. Base weighted risk score
  // -----------------------------
  let score =
    fraudScore * 0.30 +
    sarSeverity * 0.20 +
    volatilityIndex * 0.15 +
    behaviorScore * 0.20 +
    bankRiskScore * 0.15;

  // -----------------------------
  // 2. Income Verification Stabilizer (NEW)
  // -----------------------------
  // If incomeVerificationScore exists, apply stabilizer:
  //
  // High incomeVerificationScore → slightly increases riskScore
  // Low incomeVerificationScore → slightly decreases riskScore
  //
  // Formula from Step 6:
  //
  // riskScore = riskScore * (0.7 + incomeVerificationScore / 500)
  //
  // Example:
  // incomeVerificationScore = 80 → multiplier = 0.7 + 0.16 = 0.86
  // incomeVerificationScore = 20 → multiplier = 0.7 + 0.04 = 0.74
  //
  if (incomeVerificationScore !== null && !isNaN(incomeVerificationScore)) {
    const stabilizer = 0.7 + incomeVerificationScore / 500;
    score = score * stabilizer;
  }

  // -----------------------------
  // 3. Clamp score to 0–100
  // -----------------------------
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  return Math.round(score);
}

module.exports = { computeRiskScore };
