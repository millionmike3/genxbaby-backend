// genxbaby-backend/src/services/bankingService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Import pure bank risk scoring engine (pricing engine microservice)
const { computeBankRiskScore } =
  require("gx_pricing_engine/src/services/bankRiskService");

/**
 * ---------------------------------------------------------
 *  SECTION 1 — YOUR ORIGINAL BANKING FUNCTIONS
 * ---------------------------------------------------------
 */

async function listBanks(ownerId) {
  return prisma.bankProfile.findMany({ where: { ownerId } });
}

async function createBank(ownerId, data) {
  return prisma.bankProfile.create({
    data: { ownerId, ...data },
  });
}

async function listChecksByBank(bankProfileId) {
  return prisma.check.findMany({
    where: { bankProfileId },
    include: { signer: true, bankProfile: true },
  });
}

async function issueCheck(bankProfileId, payload) {
  return prisma.check.create({
    data: {
      bankProfileId,
      signerId: payload.signerId,
      checkNumber: payload.checkNumber,
      payee: payload.payee,
      amount: payload.amount,
      memo: payload.memo ?? null,
      date: new Date(payload.date),
    },
  });
}

/**
 * ---------------------------------------------------------
 *  SECTION 2 — NEW BANK RISK ENGINE WRAPPER
 * ---------------------------------------------------------
 * This produces a bankRiskScore (0–100) for risk scoring.
 * It DOES NOT replace your banking functions.
 * It simply reads aggregated bank risk stats and converts them
 * into a normalized score using computeBankRiskScore().
 */

async function getBankRiskScore(ownerId) {
  const stats = await prisma.bankRiskStats.findUnique({
    where: { ownerId },
  });

  const signals = {
    bankRiskTier: stats?.bankRiskTier || 1,               // 1–5
    priorFraudIncidents: stats?.priorFraudIncidents || 0,
    regulatoryActions: stats?.regulatoryActions || 0,
    sanctionsHits: stats?.sanctionsHits || 0,
    negativeNewsScore: stats?.negativeNewsScore || 0,     // 0–100
  };

  return computeBankRiskScore(signals);
}

module.exports = {
  listBanks,
  createBank,
  listChecksByBank,
  issueCheck,
  getBankRiskScore,
};
