const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Save pricing decision snapshot.
 */
async function logPricingDecision(ownerId, snapshot) {
  return prisma.pricingDecisionLog.create({
    data: {
      ownerId,

      baseRateBps: snapshot.pricingPreview.baseRateBps,
      marginBps: snapshot.pricingPreview.marginBps,
      finalRateBps: snapshot.pricingPreview.finalRateBps,

      riskScore: snapshot.riskScore,
      riskTier: snapshot.tier,

      fraudScore: snapshot.signals.fraudScore,
      sarSeverity: snapshot.signals.sarSeverity,
      volatilityIndex: snapshot.signals.volatilityIndex,
      behaviorScore: snapshot.signals.behaviorScore,
      bankRiskScore: snapshot.signals.bankRiskScore,
    },
  });
}

/**
 * Get pricing history for an owner.
 */
async function getPricingHistory(ownerId) {
  return prisma.pricingDecisionLog.findMany({
    where: { ownerId },
    orderBy: { timestamp: "desc" },
  });
}

module.exports = {
  logPricingDecision,
  getPricingHistory,
};
