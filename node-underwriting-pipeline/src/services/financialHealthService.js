const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { computeFinancialHealth } =
  require("gx_pricing_engine/src/services/financialHealthService");

async function evaluateFinancialHealth(ownerId) {
  const bankStats = await prisma.bankStats.findUnique({
    where: { ownerId },
  });

  const snapshot = {
    liquidityScore: bankStats.liquidityScore,
    incomeStability: bankStats.incomeStability,
    debtLoadScore: bankStats.debtLoadScore,
    cashFlowScore: bankStats.cashFlowScore,
    overdraftRisk: bankStats.overdraftRisk,
  };

  const financialHealthScore = computeFinancialHealth(snapshot);

  await prisma.financialHealthSnapshot.create({
    data: {
      ownerId,
      ...snapshot,
      financialHealthScore,
    },
  });

  return { ...snapshot, financialHealthScore };
}

async function getFinancialHealthHistory(ownerId) {
  return prisma.financialHealthSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "desc" },
  });
}

module.exports = {
  evaluateFinancialHealth,
  getFinancialHealthHistory,
};
