// genxbaby-backend/src/services/bankService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * 1. Extract transactions from OCR text
 * Assumes OCR text from bank statements with lines containing:
 * - date
 * - description
 * - amount
 */
function extractTransactions(text) {
  const lines = text.split("\n");
  const transactions = [];

  for (const line of lines) {
    const date = findDate(line);
    const amount = findNumber(line, ["$", "amount", "amt"]);
    const desc = line.trim();

    if (date && amount !== null && desc.length > 5) {
      transactions.push({
        date,
        amount,
        description: desc,
        type: amount > 0 ? "DEPOSIT" : "WITHDRAWAL",
      });
    }
  }

  return transactions;
}

/**
 * 2. Compute balances from transactions
 */
function computeBalances(transactions, beginningBalance = null) {
  let runningBalance = beginningBalance ?? 0;

  const balances = transactions.map((tx) => {
    runningBalance += tx.amount;
    return {
      ...tx,
      runningBalance,
    };
  });

  const endingBalance =
    balances.length > 0 ? balances[balances.length - 1].runningBalance : runningBalance;

  return {
    beginningBalance,
    endingBalance,
    balances,
  };
}

/**
 * 3. Bank Fraud Detection
 */
function detectBankFraudPatterns({ transactions, beginningBalance, endingBalance }) {
  const patterns = [];

  if (transactions.length === 0) patterns.push("NO_TRANSACTIONS");

  // Large withdrawals
  const largeWithdrawals = transactions.filter(
    (t) => t.type === "WITHDRAWAL" && Math.abs(t.amount) > 10000
  );
  if (largeWithdrawals.length > 3) patterns.push("MULTIPLE_LARGE_WITHDRAWALS");

  // Large deposits
  const largeDeposits = transactions.filter(
    (t) => t.type === "DEPOSIT" && t.amount > 10000
  );
  if (largeDeposits.length > 3) patterns.push("MULTIPLE_LARGE_DEPOSITS");

  // Negative ending balance
  if (endingBalance < 0) patterns.push("NEGATIVE_ENDING_BALANCE");

  // Excessive overdraft-like behavior (inferred)
  const overdraftEvents = transactions.filter(
    (t) => t.description.toLowerCase().includes("overdraft")
  );
  if (overdraftEvents.length > 2) patterns.push("EXCESSIVE_OVERDRAFTS");

  return patterns;
}

/**
 * 4. Bank Risk Score (0–100)
 */
function computeBankRiskScore({ transactions, fraudPatterns, beginningBalance, endingBalance }) {
  let score = 0;

  // Missing or sparse activity
  if (transactions.length === 0) score += 20;
  else if (transactions.length < 5) score += 10;

  // Large movements
  const largeMovements = transactions.filter((t) => Math.abs(t.amount) > 10000).length;
  score += largeMovements * 5;

  // Fraud patterns
  score += fraudPatterns.length * 10;

  // Negative ending balance
  if (endingBalance < 0) score += 20;

  // Volatility: big swings between beginning and ending
  if (beginningBalance !== null) {
    const delta = Math.abs(endingBalance - beginningBalance);
    if (delta > 20000) score += 10;
  }

  return Math.min(score, 100);
}

/**
 * 5. Bank Severity
 */
function computeBankSeverity(score) {
  if (score < 25) return "LOW";
  if (score < 50) return "MEDIUM";
  if (score < 75) return "HIGH";
  return "CRITICAL";
}

/**
 * 6. Bank Trend
 */
async function computeBankTrend(ownerId) {
  const history = await prisma.bankSnapshot.findMany({
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
 * 7. Build Bank Snapshot
 */
function buildBankSnapshot({
  fields,
  transactions,
  balances,
  fraudPatterns,
  riskScore,
  severity,
}) {
  return {
    fields,
    transactions,
    balances,
    fraudPatterns,
    riskScore,
    severity,
    timestamp: new Date(),
  };
}

/**
 * Helper: extract numeric values
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
 * Helper: extract dates
 */
function findDate(text) {
  const match = text.match(
    /\b(0?[1-9]|1[0-2])[\/\-\.](0?[1-9]|[12][0-9]|3[01])[\/\-\.](\d{2,4})\b/
  );
  return match ? match[0] : null;
}

module.exports = {
  extractTransactions,
  computeBalances,
  detectBankFraudPatterns,
  computeBankRiskScore,
  computeBankSeverity,
  computeBankTrend,
  buildBankSnapshot,
  findNumber,
  findDate,
};
