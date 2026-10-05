const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Simple scoring model:
 * - incomeStability: consistency of deposits / pay dates
 * - employerMatch: name/address match between docs and owner/employer
 * - bankMatch: income vs bank inflows
 */
function computeIncomeVerificationScore({
  incomeStability,
  employerMatch,
  bankMatch,
}) {
  return Math.round(
    incomeStability * 0.4 +
    employerMatch * 0.3 +
    bankMatch * 0.3
  );
}

async function evaluateIncomeFromBankStatements(ownerId) {
  const bankStats = await prisma.bankStats.findUnique({
    where: { ownerId },
  });

  if (!bankStats) {
    return null;
  }

  const grossMonthlyIncome = bankStats.avgMonthlyDeposits;
  const netMonthlyIncome = Math.round(bankStats.avgMonthlyDeposits * 0.8);

  const incomeStability = bankStats.depositConsistencyScore; // 0–100
  const bankMatch = bankStats.incomeVsSpendingScore; // 0–100
  const employerMatch = 70; // placeholder until you wire employer data

  const incomeVerificationScore = computeIncomeVerificationScore({
    incomeStability,
    employerMatch,
    bankMatch,
  });

  const snapshot = await prisma.incomeVerificationSnapshot.create({
    data: {
      ownerId,
      sourceType: "BANK_STATEMENT",
      grossMonthlyIncome,
      netMonthlyIncome,
      incomeStability,
      employerMatch,
      bankMatch,
      incomeVerificationScore,
    },
  });

  return snapshot;
}

async function getIncomeVerificationHistory(ownerId) {
  return prisma.incomeVerificationSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "desc" },
  });
}

module.exports = {
  evaluateIncomeFromBankStatements,
  getIncomeVerificationHistory,
};
