async function priceLoan(ownerId, baseRateBps) {
  const config = await prisma.ownerConfig.findUnique({ where: { ownerId } });

  const riskScore = await computeRiskScore(ownerId); // from fraud/SAR/behavior engines

  return computePricing(baseRateBps, config, riskScore);
}
