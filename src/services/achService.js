// genxbaby-backend/src/services/achService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Parse ACH entries from OCR text
 * Supports:
 * - Deposits (credits)
 * - Withdrawals (debits)
 * - Returns (R01–R99)
 * - Reversals
 */
function parseACHEntries(text) {
  const lines = text.split("\n");
  const entries = [];

  for (const line of lines) {
    const lower = line.toLowerCase();

    const isACH =
      lower.includes("ach") ||
      lower.includes("electronic") ||
      lower.includes("transfer") ||
      lower.includes("deposit") ||
      lower.includes("withdrawal") ||
      lower.includes("eft") ||
      lower.includes("nacha") ||
      lower.includes("return") ||
      lower.includes("r0");

    if (!isACH) continue;

    const amount = findAmount(line);
    const date = findDate(line);

    entries.push({
      raw: line.trim(),
      date,
      amount,
      type: detectACHType(lower, amount),
      returnCode: extractReturnCode(lower),
    });
  }

  return entries;
}

/**
 * Detect ACH type
 */
function detectACHType(lower, amount) {
  if (lower.includes("deposit") || amount > 0) return "DEPOSIT";
  if (lower.includes("withdrawal") || amount < 0) return "WITHDRAWAL";
  if (lower.includes("return") || lower.match(/r\d{2}/)) return "RETURN";
  if (lower.includes("reversal")) return "REVERSAL";
  return "UNKNOWN";
}

/**
 * Extract return code (R01–R99)
 */
function extractReturnCode(lower) {
  const match = lower.match(/r\d{2}/);
  return match ? match[0].toUpperCase() : null;
}

/**
 * Extract numeric amount
 */
function findAmount(text) {
  const match = text.match(/[-]?\$?\s*[\d,.]+/);
  if (!match) return null;
  return parseFloat(match[0].replace(/[$,\s]/g, ""));
}

/**
 * Extract date
 */
function findDate(text) {
  const match = text.match(
    /\b(0?[1-9]|1[0-2])[\/\-\.](0?[1-9]|[12][0-9]|3[01])[\/\-\.](\d{2,4})\b/
  );
  return match ? match[0] : null;
}

/**
 * ACH Fraud Detection
 */
function detectACHFraudPatterns(entries) {
  const patterns = [];

  if (entries.length === 0) patterns.push("NO_ACH_ACTIVITY");

  const deposits = entries.filter((e) => e.type === "DEPOSIT");
  const withdrawals = entries.filter((e) => e.type === "WITHDRAWAL");
  const returns = entries.filter((e) => e.type === "RETURN");

  // Excessive large deposits
  const largeDeposits = deposits.filter((d) => d.amount > 10000);
  if (largeDeposits.length > 3) patterns.push("MULTIPLE_LARGE_DEPOSITS");

  // Excessive large withdrawals
  const largeWithdrawals = withdrawals.filter((w) => Math.abs(w.amount) > 10000);
  if (largeWithdrawals.length > 3) patterns.push("MULTIPLE_LARGE_WITHDRAWALS");

  // High return rate
  if (returns.length >= 3) patterns.push("EXCESSIVE_ACH_RETURNS");

  // Specific return codes
  const highRiskCodes = ["R01", "R02", "R03", "R04", "R05", "R07", "R10", "R16"];
  const flagged = returns.filter((r) => highRiskCodes.includes(r.returnCode));
  if (flagged.length > 0) patterns.push("HIGH_RISK_RETURN_CODES");

  // Rapid ACH activity
  if (entries.length > 20) patterns.push("EXCESSIVE_ACH_ACTIVITY");

  return patterns;
}

/**
 * ACH Risk Score (0–100)
 */
function computeACHRiskScore({ entries, fraudPatterns }) {
  let score = 0;

  // Large movements
  const largeMovements = entries.filter((e) => Math.abs(e.amount) > 10000).length;
  score += largeMovements * 5;

  // Fraud patterns
  score += fraudPatterns.length * 10;

  // Rapid activity
  if (entries.length > 20) score += 20;

  return Math.min(score, 100);
}

/**
 * Severity Classification
 */
function computeACHSeverity(score) {
  if (score < 25) return "LOW";
  if (score < 50) return "MEDIUM";
  if (score < 75) return "HIGH";
  return "CRITICAL";
}

/**
 * Trend Analysis
 */
async function computeACHTrend(ownerId) {
  const history = await prisma.achSnapshot.findMany({
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
 * Build Snapshot Object
 */
function buildACHSnapshot({ entries, fraudPatterns, riskScore, severity }) {
  return {
    entries,
    fraudPatterns,
    riskScore,
    severity,
    timestamp: new Date(),
  };
}

module.exports = {
  parseACHEntries,
  detectACHFraudPatterns,
  computeACHRiskScore,
  computeACHSeverity,
  computeACHTrend,
  buildACHSnapshot,
};
