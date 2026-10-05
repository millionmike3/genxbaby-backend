// genxbaby-backend/src/services/scoringMatrixService.js

/**
 * Unified scoring matrix for all subsystems.
 * This engine defines how each module contributes to global risk.
 */

const BASE_WEIGHTS = {
  verification: 0.20,
  fraud: 0.20,
  volatility: 0.15,
  behavior: 0.10,
  income: 0.10,
  bank: 0.10,
  cashflow: 0.10,
  checks: 0.05,
  ach: 0.05,
};

/**
 * 1. Dynamic weight adjustments based on severity
 */
function adjustWeightsBySeverity(subsystemScores) {
  const weights = { ...BASE_WEIGHTS };

  // Fraud amplification
  if (subsystemScores.fraudScore >= 75) {
    weights.fraud += 0.10;
    weights.verification += 0.05;
  }

  // Volatility amplification
  if (subsystemScores.volatilityScore >= 70) {
    weights.volatility += 0.05;
    weights.cashflow += 0.05;
  }

  // Behavior amplification
  if (subsystemScores.behaviorScore >= 60) {
    weights.behavior += 0.05;
  }

  // Income instability amplification
  if (subsystemScores.incomeScore >= 60) {
    weights.income += 0.05;
  }

  // Normalize weights to sum to 1.0
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  for (const key of Object.keys(weights)) {
    weights[key] = weights[key] / total;
  }

  return weights;
}

/**
 * 2. Compute weighted score using dynamic matrix
 */
function computeWeightedScore(subsystemScores) {
  const weights = adjustWeightsBySeverity(subsystemScores);

  const score =
    subsystemScores.verificationScore * weights.verification +
    subsystemScores.fraudScore * weights.fraud +
    subsystemScores.volatilityScore * weights.volatility +
    subsystemScores.behaviorScore * weights.behavior +
    subsystemScores.incomeScore * weights.income +
    subsystemScores.bankScore * weights.bank +
    subsystemScores.cashflowScore * weights.cashflow +
    subsystemScores.checksScore * weights.checks +
    subsystemScores.achScore * weights.ach;

  return Math.min(100, Math.max(0, score));
}

/**
 * 3. Fraud amplification logic
 */
function applyFraudAmplification(score, fraudScore) {
  if (fraudScore >= 90) return score + 15;
  if (fraudScore >= 75) return score + 10;
  if (fraudScore >= 50) return score + 5;
  return score;
}

/**
 * 4. Volatility amplification logic
 */
function applyVolatilityAmplification(score, volatilityScore) {
  if (volatilityScore >= 80) return score + 10;
  if (volatilityScore >= 60) return score + 5;
  return score;
}

/**
 * 5. Behavior amplification logic
 */
function applyBehaviorAmplification(score, behaviorScore) {
  if (behaviorScore >= 70) return score + 8;
  if (behaviorScore >= 50) return score + 4;
  return score;
}

/**
 * 6. Final scoring pipeline
 */
function computeFinalScore(subsystemScores) {
  let score = computeWeightedScore(subsystemScores);

  score = applyFraudAmplification(score, subsystemScores.fraudScore);
  score = applyVolatilityAmplification(score, subsystemScores.volatilityScore);
  score = applyBehaviorAmplification(score, subsystemScores.behaviorScore);

  return Math.min(100, score);
}

/**
 * 7. Severity mapping
 */
function mapSeverity(score) {
  if (score < 25) return "LOW";
  if (score < 50) return "MEDIUM";
  if (score < 75) return "HIGH";
  return "CRITICAL";
}

/**
 * 8. Build scoring matrix output
 */
function buildScoringMatrix(subsystemScores) {
  const finalScore = computeFinalScore(subsystemScores);
  const severity = mapSeverity(finalScore);

  return {
    weights: adjustWeightsBySeverity(subsystemScores),
    finalScore,
    severity,
  };
}

module.exports = {
  adjustWeightsBySeverity,
  computeWeightedScore,
  applyFraudAmplification,
  applyVolatilityAmplification,
  applyBehaviorAmplification,
  computeFinalScore,
  mapSeverity,
  buildScoringMatrix,
};
