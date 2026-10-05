// genxbaby-backend/src/services/volatilityService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Compute standard deviation helper
 */
function stdDev(values) {
  if (!values || values.length < 2) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Income volatility from incomeSnapshot history (grossMonthly or netMonthly)
 */
async function computeIncomeVolatility(ownerId) {
  const history = await prisma.incomeSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "asc" },
  });

  const series =
    history.map(
      (h) =>
        h.extractedFields?.grossMonthly ||
        h.extractedFields?.netMonthly ||
        0
    ) || [];

  const volatility = stdDev(series);
  return { series, volatility };
}

/**
 * Bank volatility from bankSnapshot history (endingBalance)
 */
async function computeBankVolatility(ownerId) {
  const history = await prisma.bankSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "asc" },
  });

  const series =
    history.map((h) => h.balances?.endingBalance || 0) || [];

  const volatility = stdDev(series);
  return { series, volatility };
}

/**
 * Cashflow volatility from cashflowSnapshot history (netMonthlyCashflow)
 */
async function computeCashflowVolatility(ownerId) {
  const history = await prisma.cashflowSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "asc" },
  });

  const series =
    history.map((h) => h.monthlyCashflow?.net || 0) || [];

  const volatility = stdDev(series);
  return { series, volatility };
}

/**
 * Aggregate volatility into a single score (0–100)
 */
function computeVolatilityScore({
  incomeVol,
  bankVol,
  cashflowVol,
}) {
  // Simple normalization: treat > 5x swings as high
  const incomeScore = Math.min(incomeVol / 500, 1) * 30;     // up to 30
  const bankScore = Math.min(bankVol / 1000, 1) * 35;        // up to 35
  const cashflowScore = Math.min(cashflowVol / 500, 1) * 35; // up to 35

  const total = incomeScore + bankScore + cashflowScore;
  return Math.min(Math.round(total), 100);
}

/**
 * Volatility severity
 */
function computeVolatilitySeverity(score) {
  if (score < 25) return "LOW";
  if (score < 50) return "MEDIUM";
  if (score < 75) return "HIGH";
  return "CRITICAL";
}

/**
 * Volatility trend
 */
async function computeVolatilityTrend(ownerId) {
  const history = await prisma.volatilitySnapshot.findMany({
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
 * Build volatility snapshot object
 */
function buildVolatilitySnapshot({
  incomeSeries,
  bankSeries,
  cashflowSeries,
  incomeVol,
  bankVol,
  cashflowVol,
  score,
  severity,
}) {
  return {
    incomeSeries,
    bankSeries,
    cashflowSeries,
    incomeVol,
    bankVol,
    cashflowVol,
    score,
    severity,
    timestamp: new Date(),
  };
}

module.exports = {
  computeIncomeVolatility,
  computeBankVolatility,
  computeCashflowVolatility,
  computeVolatilityScore,
  computeVolatilitySeverity,
  computeVolatilityTrend,
  buildVolatilitySnapshot,
};
