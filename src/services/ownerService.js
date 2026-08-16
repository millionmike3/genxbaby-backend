// genxbaby-backend/src/services/ownerService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * 1. Aggregate all subsystem snapshots for an owner
 */
async function aggregateOwnerData(ownerId) {
  const [
    verification,
    fraud,
    risk,
    volatility,
    behavior,
    income,
    bank,
    cashflow,
    checks,
    ach,
    documents,
    ocr,
  ] = await Promise.all([
    prisma.verificationSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
    prisma.fraudSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
    prisma.riskSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
    prisma.volatilitySnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
    prisma.behaviorSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
    prisma.incomeSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
    prisma.bankSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
    prisma.cashflowSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
    prisma.checkSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
    prisma.achSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
    prisma.documentSnapshot.findMany({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
    prisma.ocrSnapshot.findMany({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
  ]);

  return {
    verification,
    fraud,
    risk,
    volatility,
    behavior,
    income,
    bank,
    cashflow,
    checks,
    ach,
    documents,
    ocr,
  };
}

/**
 * 2. Build unified owner profile
 */
function buildOwnerProfile(owner, data) {
  return {
    ownerId: owner.id,
    name: owner.name,
    email: owner.email,
    createdAt: owner.createdAt,
    updatedAt: owner.updatedAt,

    // Core intelligence modules
    verification: data.verification,
    fraud: data.fraud,
    risk: data.risk,
    volatility: data.volatility,
    behavior: data.behavior,
    income: data.income,
    bank: data.bank,
    cashflow: data.cashflow,
    checks: data.checks,
    ach: data.ach,

    // Document intelligence
    documents: data.documents,
    ocr: data.ocr,

    // Unified scoring
    scores: {
      verification: data.verification?.score ?? 0,
      fraud: data.fraud?.score ?? 0,
      risk: data.risk?.globalScore ?? 0,
      volatility: data.volatility?.score ?? 0,
      behavior: data.behavior?.riskScore ?? 0,
      income: data.income?.riskScore ?? 0,
      bank: data.bank?.riskScore ?? 0,
      cashflow: data.cashflow?.riskScore ?? 0,
      checks: data.checks?.riskScore ?? 0,
      ach: data.ach?.riskScore ?? 0,
    },

    // Unified severity
    severity: {
      verification: data.verification?.severity ?? "UNKNOWN",
      fraud: data.fraud?.severity ?? "UNKNOWN",
      risk: data.risk?.severity ?? "UNKNOWN",
      volatility: data.volatility?.severity ?? "UNKNOWN",
      behavior: data.behavior?.severity ?? "UNKNOWN",
      income: data.income?.severity ?? "UNKNOWN",
      bank: data.bank?.severity ?? "UNKNOWN",
      cashflow: data.cashflow?.severity ?? "UNKNOWN",
      checks: data.checks?.severity ?? "UNKNOWN",
      ach: data.ach?.severity ?? "UNKNOWN",
    },

    // Unified trends
    trends: {
      verification: data.verification?.trend ?? "stable",
      fraud: data.fraud?.trend ?? "stable",
      risk: data.risk?.trend ?? "stable",
      volatility: data.volatility?.trend ?? "stable",
      behavior: data.behavior?.trend ?? "stable",
      income: data.income?.trend ?? "stable",
      bank: data.bank?.trend ?? "stable",
      cashflow: data.cashflow?.trend ?? "stable",
      checks: data.checks?.trend ?? "stable",
      ach: data.ach?.trend ?? "stable",
    },
  };
}

/**
 * 3. Fetch full owner intelligence profile
 */
async function getOwnerProfile(ownerId) {
  const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
  if (!owner) return null;

  const data = await aggregateOwnerData(ownerId);
  return buildOwnerProfile(owner, data);
}

module.exports = {
  aggregateOwnerData,
  buildOwnerProfile,
  getOwnerProfile,
};
