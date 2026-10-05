// genxbaby-backend/src/services/behaviorService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Compute spending behavior from cashflowSnapshot history
 */
async function computeSpendingBehavior(ownerId) {
  const history = await prisma.cashflowSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "asc" },
  });

  const monthlySpending =
    history.map((h) => h.monthlyCashflow?.expenses || 0) || [];

  const avg = monthlySpending.reduce((s, v) => s + v, 0) / (monthlySpending.length || 1);
  const spikes = monthlySpending.filter((v) => v > avg * 1.5).length;

  return {
    series: monthlySpending,
    avg,
    spikes,
  };
}

/**
 * Compute deposit behavior from bankSnapshot history
 */
async function computeDepositBehavior(ownerId) {
  const history = await prisma.bankSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "asc" },
  });

  const deposits =
    history.map((h) => h.deposits?.totalMonthlyDeposits || 0) || [];

  const avg = deposits.reduce((s, v) => s + v, 0) / (deposits.length || 1);
  const volatility = stdDev(deposits);

  return {
    series: deposits,
    avg,
    volatility,
  };
}

/**
 * Compute withdrawal behavior from bankSnapshot history
 */
async function computeWithdrawalBehavior(ownerId) {
  const history = await prisma.bankSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "asc" },
  });

  const withdrawals =
    history.map((h) => h.withdrawals?.totalMonthlyWithdrawals || 0) || [];

  const avg = withdrawals.reduce((s, v) => s + v, 0) / (withdrawals.length || 1);
  const volatility = stdDev(withdrawals);

  return {
    series: withdrawals,
    avg,
    volatility,
  };
}

/**
 * Compute ACH behavior from achSnapshot history
 */
async function computeACHBehavior(ownerId) {
  const history = await prisma.achSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "asc" },
  });

  const counts = history.map((h) => (h.entries?.length || 0));
  const returns = history.map(
    (h) => (h.entries?.filter((e) => e.type === "RETURN").length || 0)
  );

  return {
    counts,
    returns,
    volatility: stdDev(counts),
    returnVolatility: stdDev(returns),
  };
}

/**
 * Compute check behavior from checkSnapshot history
 */
async function computeCheckBehavior(ownerId) {
  const history = await prisma.checkSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "asc" },
  });

  const amounts = history.map((h) => h.fields?.amount || 0);
  const volatility = stdDev(amounts);

  return {
    amounts,
    volatility,
  };
}

/**
 * Compute credit behavior from creditSnapshot history
 */
async function computeCreditBehavior(ownerId) {
  const history = await prisma.creditSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "asc" },
  });

  const balances = history.map((h) => h.totalDebt || 0);
  const monthlyDebt = history.map((h) => h.monthlyDebt || 0);

  return {
    balances,
    monthlyDebt,
    balanceVolatility: stdDev(balances),
    monthlyDebtVolatility: stdDev(monthlyDebt),
  };
}

/**
 * Standard deviation helper
 */
function stdDev(values) {
  if (!values || values.length < 2) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Compute global behavior score (0–100)
 */
function computeBehaviorScore({
  spending,
  deposits,
  withdrawals,
  ach,
  checks,
  credit,
}) {
  let score = 0;

  // Spending spikes
  score += spending.spikes * 5;

  // Deposit volatility
  score += Math.min(deposits.volatility / 500, 1) * 20;

  // Withdrawal volatility
  score += Math.min(withdrawals.volatility / 500, 1) * 20;

  // ACH return volatility
  score += Math.min(ach.returnVolatility / 5, 1) * 20;

  // Check volatility
  score += Math.min(checks.volatility / 1000, 1) * 10;

  // Credit volatility
  score += Math.min(credit.balanceVolatility / 5000, 1) * 25;

  return Math.min(Math.round(score), 100);
}

/**
 * Behavior severity
 */
function computeBehaviorSeverity(score) {
  if (score < 25) return "LOW";
  if (score < 50) return "MEDIUM";
  if (score < 75) return "HIGH";
  return "CRITICAL";
}

/**
 * Behavior trend
 */
async function computeBehaviorTrend(ownerId) {
  const history = await prisma.behaviorSnapshot.findMany({
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
 * Build behavior snapshot
 */
function buildBehaviorSnapshot({
  spending,
  deposits,
  withdrawals,
  ach,
  checks,
  credit,
  score,
  severity,
}) {
  return {
    spending,
    deposits,
    withdrawals,
    ach,
    checks,
    credit,
    score,
    severity,
    timestamp: new Date(),
  };
}

module.exports = {
  computeSpendingBehavior,
  computeDepositBehavior,
  computeWithdrawalBehavior,
  computeACHBehavior,
  computeCheckBehavior,
  computeCreditBehavior,
  computeBehaviorScore,
  computeBehaviorSeverity,
  computeBehaviorTrend,
  buildBehaviorSnapshot,
};
