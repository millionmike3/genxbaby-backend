// genxbaby-backend/src/services/riskService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Collect subsystem risk scores
 */
async function collectSubsystemScores(ownerId) {
  const [
    incomeSnap,
    bankSnap,
    cashflowSnap,
    creditSnap,
    dtiSnap,
    checkSnap,
    achSnap,
    fraudSnap,
    verificationSnap,
  ] = await Promise.all([
    prisma.incomeSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    }),
    prisma.bankSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    }),
    prisma.cashflowSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    }),
    prisma.creditSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    }),
    prisma.dtiSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    }),
    prisma.checkSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    }),
    prisma.achSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    }),
    prisma.fraudSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    }),
    prisma.verificationSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    }),
  ]);

  return {
    income: incomeSnap?.score || 0,
    bank: bankSnap?.riskScore || 0,
    cashflow: cashflowSnap?.riskScore || 0,
    credit: creditSnap?.riskScore || 0,
    dti: dtiSnap?.severity === "CRITICAL" ? 100 : dtiSnap?.dti || 0,
    checks: checkSnap?.riskScore || 0,
    ach: achSnap?.riskScore || 0,
    fraud: fraudSnap?.score || 0,
    verification: verificationSnap?.score || 0,
  };
}

/**
 * Weighting model for global risk score
 */
function applyRiskWeights(scores) {
  return (
    scores.income * 0.10 +
    scores.bank * 0.15 +
    scores.cashflow * 0.15 +
    scores.credit * 0.20 +
    scores.dti * 0.15 +
    scores.checks * 0.05 +
    scores.ach * 0.05 +
    scores.fraud * 0.10 +
    scores.verification * 0.05
  );
}

/**
 * Compute global risk score (0–100)
 */
function computeGlobalRiskScore(scores) {
  const weighted = applyRiskWeights(scores);
  return Math.min(Math.round(weighted), 100);
}

/**
 * Compute global severity
 */
function computeGlobalRiskSeverity(score) {
  if (score < 25) return "LOW";
  if (score < 50) return "MEDIUM";
  if (score < 75) return "HIGH";
  return "CRITICAL";
}

/**
 * Compute global risk trend
 */
async function computeGlobalRiskTrend(ownerId) {
  const history = await prisma.riskSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "asc" },
  });

  if (history.length < 2) return "stable";

  const last = history[history.length - 1].score;
  const prev = history[history.length - 2].score;

  if (last < prev) return "improving";
  if (last > prev) return "worsening";
  return "stable";
}

/**
 * Build risk snapshot object
 */
function buildRiskSnapshot({ scores, score, severity }) {
  return {
    subsystemScores: scores,
    score,
    severity,
    timestamp: new Date(),
  };
}

module.exports = {
  collectSubsystemScores,
  computeGlobalRiskScore,
  computeGlobalRiskSeverity,
  computeGlobalRiskTrend,
  buildRiskSnapshot,
};
