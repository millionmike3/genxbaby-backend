// genxbaby-backend/src/services/creditPipelineService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const creditService = require("./creditReportService");
const dtiService = require("./dtiService");

/**
 * 1. Run full credit + DTI pipeline
 */
async function runCreditPipeline(ownerId, ocrText) {
  // Step 1: Extract SSN
  const ssn = creditService.extractSSN(ocrText);

  // Step 2: Extract tradelines
  const tradelines = creditService.extractTradelines(ocrText);

  // Step 3: Compute monthly debt + total debt
  const monthlyDebt = creditService.computeMonthlyDebt(tradelines);
  const totalDebt = creditService.computeTotalDebt(tradelines);

  // Step 4: Fraud patterns
  const fraudPatterns = creditService.detectCreditFraudPatterns({
    ssn,
    tradelines,
  });

  // Step 5: Credit risk score
  const riskScore = creditService.computeCreditRiskScore({
    tradelines,
    fraudPatterns,
  });

  const severity = creditService.computeCreditSeverity(riskScore);
  const trend = await creditService.computeCreditTrend(ownerId);

  // Step 6: Save credit snapshot
  const creditSnapshot = await prisma.creditSnapshot.create({
    data: {
      ownerId,
      ssn,
      tradelines,
      monthlyDebt,
      totalDebt,
      fraudPatterns,
      riskScore,
      severity,
      trend,
      timestamp: new Date(),
    },
  });

  // Step 7: Pull latest income snapshot
  const incomeSnap = await prisma.incomeSnapshot.findFirst({
    where: { ownerId },
    orderBy: { timestamp: "desc" },
  });

  const grossMonthlyIncome =
    incomeSnap?.fields?.grossPay || incomeSnap?.fields?.netPay || 0;

  // Step 8: Compute DTI
  const dti = dtiService.computeDTI({
    monthlyDebt,
    grossMonthlyIncome,
  });

  const dtiFraud = dtiService.detectDTIFraudPatterns({
    dti,
    monthlyDebt,
    grossMonthlyIncome,
  });

  const dtiSeverity = dtiService.computeDTISeverity(dti);
  const dtiTrend = await dtiService.computeDTITrend(ownerId);

  // Step 9: Save DTI snapshot
  const dtiSnapshot = await prisma.dtiSnapshot.create({
    data: {
      ownerId,
      dti,
      monthlyDebt,
      grossMonthlyIncome,
      fraudPatterns: dtiFraud,
      severity: dtiSeverity,
      trend: dtiTrend,
      timestamp: new Date(),
    },
  });

  return {
    credit: creditSnapshot,
    dti: dtiSnapshot,
  };
}

module.exports = {
  runCreditPipeline,
};
