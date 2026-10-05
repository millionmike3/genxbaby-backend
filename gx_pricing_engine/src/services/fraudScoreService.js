// gx_pricing_engine/src/services/fraudScoreService.js

/**
 * Compute fraud score (0–100) from raw signals.
 * Higher = more fraud risk.
 */
function computeFraudScore({
  confirmedFraudFlags = 0,   // count
  suspectedFraudFlags = 0,   // count
  nsfChecks = 0,             // count
  velocityAlerts = 0,        // count
  anomalyScore = 0,          // 0–100
}) {
  const confirmedWeight = 25;
  const suspectedWeight = 15;
  const nsfWeight = 10;
  const velocityWeight = 10;
  const anomalyWeight = 40;

  let score =
    confirmedFraudFlags * confirmedWeight +
    suspectedFraudFlags * suspectedWeight +
    nsfChecks * nsfWeight +
    velocityAlerts * velocityWeight +
    anomalyScore * (anomalyWeight / 100);

  if (score > 100) score = 100;
  return Math.round(score);
}

module.exports = { computeFraudScore };
