// genxbaby-backend/src/services/riskHistoryService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Save a full underwriting snapshot.
 */
async function logRiskSnapshot(ownerId, snapshot) {
  return prisma.riskHistoryLog.create({
    data: {
      ownerId,
      fraudScore: snapshot.signals.fraudScore,
      sarSeverity: snapshot.signals.sarSeverity,
      volatilityIndex: snapshot.signals.volatilityIndex,
      behaviorScore: snapshot.signals.behaviorScore,
      bankRiskScore: snapshot.signals.bankRiskScore,

      riskScore: snapshot.riskScore,
      riskTier: snapshot.tier,
      finalRateBps: snapshot.pricingPreview.finalRateBps,
    },
  });
}

/**
 * Get full risk history for an owner.
 */
async function getRiskHistory(ownerId) {
  return prisma.riskHistoryLog.findMany({
    where: { ownerId },
    orderBy: { timestamp: "desc" },
  });
}

module.exports = {
  logRiskSnapshot,
  getRiskHistory,
};
