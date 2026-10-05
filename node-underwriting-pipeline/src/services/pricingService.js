const { computePricing } =
  require("gx_pricing_engine/src/services/pricingEngine");
const { computeRiskScore } =
  require("gx_pricing_engine/src/services/riskScoreService");

async function priceLoan(ownerId, baseRateBps) {
  const config = await prisma.ownerConfig.findUnique({ where: { ownerId } });

  // Pull signals from your fraud/SAR/behavior/bank services
  const fraudScore = await getFraudScore(ownerId);
  const sarSeverity = await getSarSeverity(ownerId);
  const volatilityIndex = await getVolatilityIndex(ownerId);
  const behaviorScore = await getBehaviorScore(ownerId);
  const bankRiskScore = await getBankRiskScore(ownerId);

  const riskScore = computeRiskScore({
    fraudScore,
    sarSeverity,
    volatilityIndex,
    behaviorScore,
    bankRiskScore,
  });

  return computePricing(baseRateBps, config, riskScore);
}

module.exports = { priceLoan };
