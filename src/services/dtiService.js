// genxbaby-backend/src/services/dtiService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * 1. Compute DTI
 */
function computeDTI({ monthlyDebt, grossMonthlyIncome }) {
  if (!grossMonthlyIncome || grossMonthlyIncome === 0) return 999;

  return (monthlyDebt / grossMonthlyIncome) * 100;
}

/**
 * 2. DTI Fraud Patterns
 */
function detectDTIFraudPatterns({ dti, monthlyDebt, grossMonthlyIncome }) {
  const patterns = [];

  if (!grossMonthlyIncome) patterns.push("MISSING_INCOME");
  if (!monthlyDebt) patterns.push("NO_DEBT_FOUND");

  if (dti > 100) patterns.push("DTI_OVER_100_PERCENT");
  if (dti > 70) patterns.push("EXTREME_DTI");

  return patterns;
}

/**
 * 3. DTI Severity
 */
function computeDTISeverity(dti) {
  if (dti < 20) return "LOW";
  if (dti < 36) return "MEDIUM";
  if (dti < 50) return "HIGH";
  return "CRITICAL";
}

/**
 * 4. Trend
 */
async function computeDTITrend(ownerId) {
  const history = await prisma.dtiSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "asc" },
  });

  if (history.length < 2) return "stable";

  const last = history[history.length - 1].dti;
  const prev = history[history.length - 2].dti;

  if (last < prev) return "improving";
  if (last > prev) return "worsening";
  return "stable";
}

/**
 * 5. Build Snapshot
 */
function buildDTISnapshot({ dti, monthlyDebt, grossMonthlyIncome, fraudPatterns, severity }) {
  return {
    dti,
    monthlyDebt,
    grossMonthlyIncome,
    fraudPatterns,
    severity,
    timestamp: new Date(),
  };
}

module.exports = {
  computeDTI,
  detectDTIFraudPatterns,
  computeDTISeverity,
  computeDTITrend,
  buildDTISnapshot,
};
