// genxbaby-backend/src/services/creditReportService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Extract SSN from OCR text
 */
function extractSSN(text) {
  const match = text.match(/\b\d{3}-\d{2}-\d{4}\b/);
  return match ? match[0] : null;
}

/**
 * Extract tradelines from OCR text
 * Supports:
 * - Revolving (credit cards)
 * - Installment (loans)
 * - Auto loans
 * - Student loans
 * - Mortgages
 * - Collections
 */
function extractTradelines(text) {
  const lines = text.split("\n");
  const tradelines = [];

  for (const line of lines) {
    const lower = line.toLowerCase();

    const isTradeline =
      lower.includes("account") ||
      lower.includes("credit") ||
      lower.includes("loan") ||
      lower.includes("mortgage") ||
      lower.includes("auto") ||
      lower.includes("student") ||
      lower.includes("revolving") ||
      lower.includes("installment") ||
      lower.includes("collection");

    if (!isTradeline) continue;

    tradelines.push({
      description: line.trim(),
      balance: findNumber(line, ["balance", "$"]),
      monthlyPayment: findNumber(line, ["payment", "monthly"]),
      type: detectTradelineType(lower),
    });
  }

  return tradelines;
}

/**
 * Detect tradeline type
 */
function detectTradelineType(lower) {
  if (lower.includes("revolving")) return "REVOLVING";
  if (lower.includes("credit")) return "REVOLVING";
  if (lower.includes("installment")) return "INSTALLMENT";
  if (lower.includes("auto")) return "AUTO_LOAN";
  if (lower.includes("student")) return "STUDENT_LOAN";
  if (lower.includes("mortgage")) return "MORTGAGE";
  if (lower.includes("collection")) return "COLLECTION";
  return "UNKNOWN";
}

/**
 * Extract numeric values
 */
function findNumber(text, keywords) {
  const lower = text.toLowerCase();
  for (const key of keywords) {
    if (lower.includes(key.toLowerCase())) {
      const match = text.match(/[\d,.]+/);
      return match ? parseFloat(match[0].replace(/,/g, "")) : null;
    }
  }
  return null;
}

/**
 * Compute total monthly debt obligations
 */
function computeMonthlyDebt(tradelines) {
  return tradelines.reduce(
    (sum, t) => sum + (t.monthlyPayment || 0),
    0
  );
}

/**
 * Compute total outstanding debt
 */
function computeTotalDebt(tradelines) {
  return tradelines.reduce(
    (sum, t) => sum + (t.balance || 0),
    0
  );
}

/**
 * Credit Fraud Detection
 */
function detectCreditFraudPatterns({ ssn, tradelines }) {
  const patterns = [];

  if (!ssn) patterns.push("MISSING_SSN");

  if (tradelines.length === 0) patterns.push("NO_TRADLINES_FOUND");

  // Too many new accounts
  const newAccounts = tradelines.filter((t) =>
    t.description.toLowerCase().includes("opened")
  );
  if (newAccounts.length > 5) patterns.push("EXCESSIVE_NEW_ACCOUNTS");

  // Extremely high revolving debt
  const revolvingDebt = tradelines
    .filter((t) => t.type === "REVOLVING")
    .reduce((sum, t) => sum + (t.balance || 0), 0);

  if (revolvingDebt > 50000) patterns.push("HIGH_REVOLVING_DEBT");

  // Collections present
  const collections = tradelines.filter((t) => t.type === "COLLECTION");
  if (collections.length > 0) patterns.push("HAS_COLLECTIONS");

  return patterns;
}

/**
 * Credit Risk Score (0–100)
 */
function computeCreditRiskScore({ tradelines, fraudPatterns }) {
  let score = 0;

  const totalDebt = computeTotalDebt(tradelines);
  const monthlyDebt = computeMonthlyDebt(tradelines);

  score += totalDebt / 1000; // 100k debt = +100
  score += monthlyDebt / 50; // $2500 monthly debt = +50

  score += fraudPatterns.length * 10;

  return Math.min(score, 100);
}

/**
 * Severity Classification
 */
function computeCreditSeverity(score) {
  if (score < 25) return "LOW";
  if (score < 50) return "MEDIUM";
  if (score < 75) return "HIGH";
  return "CRITICAL";
}

/**
 * Trend Analysis
 */
async function computeCreditTrend(ownerId) {
  const history = await prisma.creditSnapshot.findMany({
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
function buildCreditSnapshot({
  ssn,
  tradelines,
  monthlyDebt,
  totalDebt,
  fraudPatterns,
  riskScore,
  severity,
}) {
  return {
    ssn,
    tradelines,
    monthlyDebt,
    totalDebt,
    fraudPatterns,
    riskScore,
    severity,
    timestamp: new Date(),
  };
}

module.exports = {
  extractSSN,
  extractTradelines,
  computeMonthlyDebt,
  computeTotalDebt,
  detectCreditFraudPatterns,
  computeCreditRiskScore,
  computeCreditSeverity,
  computeCreditTrend,
  buildCreditSnapshot,
};
