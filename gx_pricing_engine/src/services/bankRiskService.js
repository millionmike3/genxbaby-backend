// gx_pricing_engine/src/services/bankRiskService.js

/**
 * Compute bank risk score (0–100).
 * Higher = higher risk associated with the bank itself.
 */
function computeBankRiskScore({
  bankRiskTier = 1,        // 1–5 (1 = safest, 5 = highest risk)
  priorFraudIncidents = 0, // count
  regulatoryActions = 0,   // count
  sanctionsHits = 0,       // count
  negativeNewsScore = 0,   // 0–100
}) {
  // Base from tier (invert: higher tier → higher risk)
  let score = (bankRiskTier - 1) * 15; // 0–60

  // Add penalties
  score += priorFraudIncidents * 5;
  score += regulatoryActions * 7;
  score += sanctionsHits * 10;
  score += negativeNewsScore * 0.3;

  if (score > 100) score = 100;
  if (score < 0) score = 0;

  return Math.round(score);
}

module.exports = { computeBankRiskScore };
