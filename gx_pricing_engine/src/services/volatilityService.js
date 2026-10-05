// gx_pricing_engine/src/services/volatilityService.js

/**
 * Compute volatility index (0–100).
 * Higher = more volatile / less stable.
 */
function computeVolatilityIndex({
  balanceStdDev = 0,        // standard deviation of daily balance
  overdraftCount = 0,       // count
  nsfCount = 0,             // count
  depositVariance = 0,      // 0–100
  withdrawalVariance = 0,   // 0–100
  checkVelocity = 0,        // checks per day (normalized)
}) {
  // Weighted model
  const balanceWeight = 0.30;
  const overdraftWeight = 0.20;
  const nsfWeight = 0.20;
  const depositWeight = 0.10;
  const withdrawalWeight = 0.10;
  const velocityWeight = 0.10;

  let score =
    balanceStdDev * balanceWeight +
    overdraftCount * overdraftWeight +
    nsfCount * nsfWeight +
    depositVariance * depositWeight +
    withdrawalVariance * withdrawalWeight +
    checkVelocity * velocityWeight;

  if (score > 100) score = 100;
  return Math.round(score);
}

module.exports = { computeVolatilityIndex };
