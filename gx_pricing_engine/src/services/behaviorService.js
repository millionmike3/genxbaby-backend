// gx_pricing_engine/src/services/behaviorService.js

/**
 * Compute behavior score (0–100).
 * Higher = better behavior / more reliable.
 */
function computeBehaviorScore({
  onTimePayments = 0,     // count
  latePayments = 0,       // count
  nsfChecks = 0,          // count
  overdrafts = 0,         // count
  accountAgeMonths = 0,   // months
  cleanMonths = 0,        // months with no incidents
}) {
  // Start from a perfect score
  let score = 100;

  // Penalties
  score -= latePayments * 3;
  score -= nsfChecks * 4;
  score -= overdrafts * 4;

  // Rewards
  score += onTimePayments * 0.5;
  score += cleanMonths * 0.5;
  score += accountAgeMonths * 0.2;

  if (score > 100) score = 100;
  if (score < 0) score = 0;

  return Math.round(score);
}

module.exports = { computeBehaviorScore };
