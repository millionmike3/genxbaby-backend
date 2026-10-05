// genxbaby-backend/src/services/analyticsService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * 1. Fetch all owners with their latest snapshots
 */
async function fetchPortfolioData() {
  const owners = await prisma.owner.findMany();

  const portfolio = [];

  for (const owner of owners) {
    const [
      verification,
      fraud,
      risk,
      volatility,
      behavior,
      income,
      bank,
      cashflow,
      checks,
      ach,
    ] = await Promise.all([
      prisma.verificationSnapshot.findFirst({ where: { ownerId: owner.id }, orderBy: { timestamp: "desc" } }),
      prisma.fraudSnapshot.findFirst({ where: { ownerId: owner.id }, orderBy: { timestamp: "desc" } }),
      prisma.riskSnapshot.findFirst({ where: { ownerId: owner.id }, orderBy: { timestamp: "desc" } }),
      prisma.volatilitySnapshot.findFirst({ where: { ownerId: owner.id }, orderBy: { timestamp: "desc" } }),
      prisma.behaviorSnapshot.findFirst({ where: { ownerId: owner.id }, orderBy: { timestamp: "desc" } }),
      prisma.incomeSnapshot.findFirst({ where: { ownerId: owner.id }, orderBy: { timestamp: "desc" } }),
      prisma.bankSnapshot.findFirst({ where: { ownerId: owner.id }, orderBy: { timestamp: "desc" } }),
      prisma.cashflowSnapshot.findFirst({ where: { ownerId: owner.id }, orderBy: { timestamp: "desc" } }),
      prisma.checkSnapshot.findFirst({ where: { ownerId: owner.id }, orderBy: { timestamp: "desc" } }),
      prisma.achSnapshot.findFirst({ where: { ownerId: owner.id }, orderBy: { timestamp: "desc" } }),
    ]);

    portfolio.push({
      owner,
      verification,
      fraud,
      risk,
      volatility,
      behavior,
      income,
      bank,
      cashflow,
      checks,
      ach,
    });
  }

  return portfolio;
}

/**
 * 2. Compute portfolio-level distributions
 */
function computePortfolioDistributions(portfolio) {
  const distributions = {
    risk: { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 },
    fraud: { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 },
    volatility: { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 },
    behavior: { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 },
  };

  for (const p of portfolio) {
    if (p.risk?.severity) distributions.risk[p.risk.severity]++;
    if (p.fraud?.severity) distributions.fraud[p.fraud.severity]++;
    if (p.volatility?.severity) distributions.volatility[p.volatility.severity]++;
    if (p.behavior?.severity) distributions.behavior[p.behavior.severity]++;
  }

  return distributions;
}

/**
 * 3. Compute portfolio averages
 */
function computePortfolioAverages(portfolio) {
  const totals = {
    risk: 0,
    fraud: 0,
    volatility: 0,
    behavior: 0,
    income: 0,
    bank: 0,
    cashflow: 0,
    checks: 0,
    ach: 0,
  };

  let count = portfolio.length;

  for (const p of portfolio) {
    totals.risk += p.risk?.globalScore ?? 0;
    totals.fraud += p.fraud?.score ?? 0;
    totals.volatility += p.volatility?.score ?? 0;
    totals.behavior += p.behavior?.riskScore ?? 0;
    totals.income += p.income?.riskScore ?? 0;
    totals.bank += p.bank?.riskScore ?? 0;
    totals.cashflow += p.cashflow?.riskScore ?? 0;
    totals.checks += p.checks?.riskScore ?? 0;
    totals.ach += p.ach?.riskScore ?? 0;
  }

  return {
    risk: totals.risk / count,
    fraud: totals.fraud / count,
    volatility: totals.volatility / count,
    behavior: totals.behavior / count,
    income: totals.income / count,
    bank: totals.bank / count,
    cashflow: totals.cashflow / count,
    checks: totals.checks / count,
    ach: totals.ach / count,
  };
}

/**
 * 4. Segment portfolio into risk tiers
 */
function segmentPortfolio(portfolio) {
  const segments = {
    lowRisk: [],
    mediumRisk: [],
    highRisk: [],
    criticalRisk: [],
  };

  for (const p of portfolio) {
    const severity = p.risk?.severity ?? "LOW";

    if (severity === "LOW") segments.lowRisk.push(p);
    else if (severity === "MEDIUM") segments.mediumRisk.push(p);
    else if (severity === "HIGH") segments.highRisk.push(p);
    else segments.criticalRisk.push(p);
  }

  return segments;
}

/**
 * 5. Build full portfolio analytics object
 */
function buildPortfolioAnalytics({ portfolio, distributions, averages, segments }) {
  return {
    totalOwners: portfolio.length,
    distributions,
    averages,
    segments,
    timestamp: new Date(),
  };
}

/**
 * 6. Main analytics function
 */
async function getPortfolioAnalytics() {
  const portfolio = await fetchPortfolioData();
  const distributions = computePortfolioDistributions(portfolio);
  const averages = computePortfolioAverages(portfolio);
  const segments = segmentPortfolio(portfolio);

  return buildPortfolioAnalytics({ portfolio, distributions, averages, segments });
}

module.exports = {
  fetchPortfolioData,
  computePortfolioDistributions,
  computePortfolioAverages,
  segmentPortfolio,
  buildPortfolioAnalytics,
  getPortfolioAnalytics,
};
