// genxbaby-backend/src/services/incomeService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * 1. Income Fraud Detection
 */
function detectIncomeFraudPatterns(fields) {
  const patterns = [];

  if (!fields.grossPay) patterns.push("MISSING_GROSS_PAY");
  if (!fields.netPay) patterns.push("MISSING_NET_PAY");
  if (!fields.employer) patterns.push("MISSING_EMPLOYER");
  if (!fields.payPeriod) patterns.push("MISSING_PAY_PERIOD");

  // Suspicious YTD inconsistencies
  if (fields.ytdGross && fields.grossPay && fields.ytdGross < fields.grossPay) {
    patterns.push("YTD_LESS_THAN_GROSS");
  }

  // Net pay too close to gross (fake paystub)
  if (fields.grossPay && fields.netPay && fields.netPay > fields.grossPay * 0.95) {
    patterns.push("NET_TOO_CLOSE_TO_GROSS");
  }

  return patterns;
}

/**
 * 2. Income Risk Score (0–100)
 */
function computeIncomeRiskScore(fields, fraudPatterns) {
  let score = 0;

  const missingFields = Object.values(fields).filter((v) => !v).length;
  score += missingFields * 5;

  score += fraudPatterns.length * 10;

  // High income volatility
  if (fields.ytdGross && fields.grossPay) {
    const months = 12;
    const avgMonthly = fields.ytdGross / months;
    if (fields.grossPay < avgMonthly * 0.5) score += 15;
  }

  return Math.min(score, 100);
}

/**
 * 3. Income Severity
 */
function computeIncomeSeverity(score) {
  if (score < 25) return "LOW";
  if (score < 50) return "MEDIUM";
  if (score < 75) return "HIGH";
  return "CRITICAL";
}

/**
 * 4. Income Trend
 */
async function computeIncomeTrend(ownerId) {
  const history = await prisma.incomeSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "asc" },
  });

  if (history.length < 2) return "stable";

  const last = history[history.length - 1].riskScore;
  const prev = history[history.length - 2].riskScore;

  if (last < prev) return "improving";
  if (last > prev) return "worsening";
  return "stable";
}

/**
 * 5. Build Snapshot
 */
function buildIncomeSnapshot(fields, fraudPatterns, riskScore, severity) {
  return {
    fields,
    fraudPatterns,
    riskScore,
    severity,
    timestamp: new Date(),
  };
}

module.exports = {
  detectIncomeFraudPatterns,
  computeIncomeRiskScore,
  computeIncomeSeverity,
  computeIncomeTrend,
  buildIncomeSnapshot,
};
