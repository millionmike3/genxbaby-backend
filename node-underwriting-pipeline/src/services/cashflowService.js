// genxbaby-backend/src/services/cashflowService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * 1. Compute monthly cashflow from transactions
 */
function computeMonthlyCashflow(transactions) {
  const monthly = {};

  for (const tx of transactions) {
    const [month, day, year] = tx.date.split(/[\/\-\.]/);
    const key = `${year}-${month.padStart(2, "0")}`;

    if (!monthly[key]) {
      monthly[key] = { deposits: 0, withdrawals: 0, net: 0 };
    }

    if (tx.amount > 0) monthly[key].deposits += tx.amount;
    else monthly[key].withdrawals += Math.abs(tx.amount);

    monthly[key].net = monthly[key].deposits - monthly[key].withdrawals;
  }

  return monthly;
}

/**
 * 2. Detect recurring payments (rent, car note, loans)
 */
function detectRecurringPayments(transactions) {
  const map = {};

  for (const tx of transactions) {
    const desc = tx.description.toLowerCase();
    const amt = Math.abs(tx.amount);

    if (!map[desc]) map[desc] = [];
    map[desc].push(amt);
  }

  const recurring = [];

  for (const desc of Object.keys(map)) {
    const amounts = map[desc];

    if (amounts.length >= 3) {
      const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      recurring.push({
        description: desc,
        averageAmount: avg,
        occurrences: amounts.length,
      });
    }
  }

  return recurring;
}

/**
 * 3. Cashflow Fraud Patterns
 */
function detectCashflowFraudPatterns({ monthlyCashflow, recurringPayments }) {
  const patterns = [];

  // Negative net cashflow for 3+ months
  const negativeMonths = Object.values(monthlyCashflow).filter((m) => m.net < 0);
  if (negativeMonths.length >= 3) patterns.push("EXTENDED_NEGATIVE_CASHFLOW");

  // Excessive recurring payments
  const highRecurring = recurringPayments.filter((p) => p.averageAmount > 2000);
  if (highRecurring.length > 2) patterns.push("EXCESSIVE_RECURRING_PAYMENTS");

  // No deposits detected
  const months = Object.values(monthlyCashflow);
  const noDeposits = months.filter((m) => m.deposits === 0);
  if (noDeposits.length >= 2) patterns.push("NO_DEPOSITS_DETECTED");

  return patterns;
}

/**
 * 4. Cashflow Risk Score (0–100)
 */
function computeCashflowRiskScore({ monthlyCashflow, recurringPayments, fraudPatterns }) {
  let score = 0;

  // Negative months
  const negativeMonths = Object.values(monthlyCashflow).filter((m) => m.net < 0).length;
  score += negativeMonths * 10;

  // High recurring payments
  const highRecurring = recurringPayments.filter((p) => p.averageAmount > 2000).length;
  score += highRecurring * 10;

  // Fraud patterns
  score += fraudPatterns.length * 10;

  return Math.min(score, 100);
}

/**
 * 5. Cashflow Severity
 */
function computeCashflowSeverity(score) {
  if (score < 25) return "LOW";
  if (score < 50) return "MEDIUM";
  if (score < 75) return "HIGH";
  return "CRITICAL";
}

/**
 * 6. Cashflow Trend
 */
async function computeCashflowTrend(ownerId) {
  const history = await prisma.cashflowSnapshot.findMany({
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
 * 7. Build Snapshot
 */
function buildCashflowSnapshot({
  monthlyCashflow,
  recurringPayments,
  fraudPatterns,
  riskScore,
  severity,
}) {
  return {
    monthlyCashflow,
    recurringPayments,
    fraudPatterns,
    riskScore,
    severity,
    timestamp: new Date(),
  };
}

module.exports = {
  computeMonthlyCashflow,
  detectRecurringPayments,
  detectCashflowFraudPatterns,
  computeCashflowRiskScore,
  computeCashflowSeverity,
  computeCashflowTrend,
  buildCashflowSnapshot,
};
