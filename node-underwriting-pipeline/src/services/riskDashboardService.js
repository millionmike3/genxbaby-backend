// 7. Income Verification Score (latest snapshot)
const incomeHistory = await prisma.incomeVerificationSnapshot.findMany({
  where: { ownerId },
  orderBy: { timestamp: "desc" },
});

const latestIncome = incomeHistory[0] || null;

// 8. Log risk snapshot
await logRiskSnapshot(ownerId, {
  ownerId,
  signals,
  riskScore,
  tier,
  pricingPreview,
  incomeVerificationScore: latestIncome
    ? latestIncome.incomeVerificationScore
    : null,
});

// 9. Log pricing decision
await logPricingDecision(ownerId, {
  ownerId,
  signals,
  riskScore,
  tier,
  pricingPreview,
  incomeVerificationScore: latestIncome
    ? latestIncome.incomeVerificationScore
    : null,
});

// 10. Return dashboard payload
return {
  ownerId,
  signals,
  riskScore,
  tier,
  tierAdjustmentBps: tierAdj,
  pricingPreview,
  incomeVerificationScore: latestIncome
    ? latestIncome.incomeVerificationScore
    : null,
};
