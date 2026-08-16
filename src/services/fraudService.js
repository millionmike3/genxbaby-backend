// genxbaby-backend/src/services/fraudService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Collect fraud signals from subsystem snapshots
 */
async function collectFraudSignals(ownerId) {
  const [
    incomeSnap,
    bankSnap,
    cashflowSnap,
    creditSnap,
    dtiSnap,
    checkSnap,
    achSnap,
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
    prisma.verificationSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    }),
  ]);

  const signals = {
    income: incomeSnap?.stability?.fraudPatterns || [],
    bank: bankSnap?.fraudPatterns || [],
    cashflow: cashflowSnap?.fraudPatterns || [],
    credit: creditSnap?.fraudPatterns || [],
    dti: dtiSnap?.fraudPatterns || [],
    checks: checkSnap?.fraudPatterns || [],
    ach: achSnap?.fraudPatterns || [],
    verification: [
      ...(verificationSnap?.identityIssues || []),
      ...(verificationSnap?.incomeIssues || []),
      ...(verificationSnap?.bankIssues || []),
      ...(verificationSnap?.checkIssues || []),
      ...(verificationSnap?.achIssues || []),
      ...(verificationSnap?.creditIssues || []),
    ],
  };

  return signals;
}

/**
 * Flatten all fraud signals into a single list
 */
function flattenFraudSignals(signals) {
  return [
    ...signals.income,
    ...signals.bank,
    ...signals.cashflow,
    ...signals.credit,
    ...signals.dti,
    ...signals.checks,
    ...signals.ach,
    ...signals.verification,
  ];
}

/**
 * Compute global fraud score (0–100)
 */
function computeFraudScore(signals) {
  const all = flattenFraudSignals(signals);

  let score = 0;

  // Base: number of signals
  score += all.length * 5;

  // Weight high‑risk domains
  score += signals.credit.length * 3;
  score += signals.bank.length * 3;
  score += signals.ach.length * 3;
  score += signals.checks.length * 3;

  // Cap
  return Math.min(score, 100);
}

/**
 * Compute fraud severity
 */
function computeFraudSeverity(score) {
  if (score < 25) return "LOW";
  if (score < 50) return "MEDIUM";
  if (score < 75) return "HIGH";
  return "CRITICAL";
}

/**
 * Compute fraud trend
 */
async function computeFraudTrend(ownerId) {
  const history = await prisma.fraudSnapshot.findMany({
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
 * Build fraud snapshot object
 */
function buildFraudSnapshot({ signals, score, severity }) {
  return {
    signals,
    score,
    severity,
    timestamp: new Date(),
  };
}

module.exports = {
  collectFraudSignals,
  flattenFraudSignals,
  computeFraudScore,
  computeFraudSeverity,
  computeFraudTrend,
  buildFraudSnapshot,
};
