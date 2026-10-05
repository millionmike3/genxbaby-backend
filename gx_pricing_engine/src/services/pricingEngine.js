const { determineRiskTier, tierMarginAdjustment } =
  require("./riskTierService");

function computePricing(baseRateBps, config, riskScore) {
  const tier = determineRiskTier(riskScore);
  const tierAdj = tierMarginAdjustment(tier);

  let marginBps =
    config.target_profit_bps +
    config.risk_premium_bps +
    tierAdj;

  if (marginBps < config.min_margin_bps) marginBps = config.min_margin_bps;
  if (marginBps > config.max_margin_bps) marginBps = config.max_margin_bps;

  const finalRateBps = baseRateBps + marginBps;

  return {
    tier,
    riskScore,
    baseRateBps,
    marginBps,
    finalRateBps,
    baseRatePercent: baseRateBps / 100,
    marginPercent: marginBps / 100,
    finalRatePercent: finalRateBps / 100,
  };
}

module.exports = { computePricing };

