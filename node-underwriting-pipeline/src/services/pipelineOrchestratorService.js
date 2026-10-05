// genxbaby-backend/src/services/pipelineOrchestratorService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ocrPipeline = require("./ocrPipelineService");
const incomeService = require("./incomeService");
const bankService = require("./bankService");
const cashflowService = require("./cashflowService");
const checksService = require("./checksService");
const achService = require("./achService");
const creditPipeline = require("./creditPipelineService");
const riskService = require("./riskService");
const fraudService = require("./fraudService");
const volatilityService = require("./volatilityService");
const behaviorService = require("./behaviorService");

/**
 * RUN FULL UNDERWRITING PIPELINE FOR AN OWNER
 */
async function runFullOwnerPipeline(ownerId, files = [], creditReportText = null) {
  const results = {
    ocr: [],
    income: null,
    bank: null,
    cashflow: null,
    checks: null,
    ach: null,
    credit: null,
    dti: null,
    volatility: null,
    behavior: null,
    fraud: null,
    risk: null,
  };

  // 1. OCR → Document → Verification → Fraud → Risk
  for (const filePath of files) {
    const pipelineResult = await ocrPipeline.runOCRPipeline(ownerId, filePath);
    results.ocr.push(pipelineResult);
  }

  // 2. INCOME PIPELINE
  const incomeSnap = await prisma.incomeSnapshot.findFirst({
    where: { ownerId },
    orderBy: { timestamp: "desc" },
  });
  results.income = incomeSnap;

  // 3. BANK PIPELINE
  const bankSnap = await prisma.bankSnapshot.findFirst({
    where: { ownerId },
    orderBy: { timestamp: "desc" },
  });
  results.bank = bankSnap;

  // 4. CASHFLOW PIPELINE
  if (bankSnap?.transactions) {
    const monthlyCashflow = cashflowService.computeMonthlyCashflow(bankSnap.transactions);
    const recurringPayments = cashflowService.detectRecurringPayments(bankSnap.transactions);
    const fraudPatterns = cashflowService.detectCashflowFraudPatterns({
      monthlyCashflow,
      recurringPayments,
    });
    const riskScore = cashflowService.computeCashflowRiskScore({
      monthlyCashflow,
      recurringPayments,
      fraudPatterns,
    });
    const severity = cashflowService.computeCashflowSeverity(riskScore);
    const trend = await cashflowService.computeCashflowTrend(ownerId);

    const cashflowSnapshot = await prisma.cashflowSnapshot.create({
      data: {
        ownerId,
        monthlyCashflow,
        recurringPayments,
        fraudPatterns,
        riskScore,
        severity,
        trend,
        timestamp: new Date(),
      },
    });

    results.cashflow = cashflowSnapshot;
  }

  // 5. CHECKS PIPELINE
  const checkSnap = await prisma.checkSnapshot.findFirst({
    where: { ownerId },
    orderBy: { timestamp: "desc" },
  });
  results.checks = checkSnap;

  // 6. ACH PIPELINE
  const achSnap = await prisma.achSnapshot.findFirst({
    where: { ownerId },
    orderBy: { timestamp: "desc" },
  });
  results.ach = achSnap;

  // 7. CREDIT + DTI PIPELINE
  if (creditReportText) {
    const creditResults = await creditPipeline.runCreditPipeline(ownerId, creditReportText);
    results.credit = creditResults.credit;
    results.dti = creditResults.dti;
  }

  // 8. VOLATILITY PIPELINE
  const incomeHistory = await prisma.incomeSnapshot.findMany({ where: { ownerId } });
  const bankHistory = await prisma.bankSnapshot.findMany({ where: { ownerId } });
  const cashflowHistory = await prisma.cashflowSnapshot.findMany({ where: { ownerId } });

  const incomeVolatility = volatilityService.computeIncomeVolatility(incomeHistory);
  const balanceVolatility = volatilityService.computeBalanceVolatility(bankHistory);
  const cashflowVolatility = volatilityService.computeCashflowVolatility(cashflowHistory);

  const volatilityScore = volatilityService.computeVolatilityScore({
    incomeVolatility,
    balanceVolatility,
    cashflowVolatility,
  });

  const volatilitySeverity = volatilityService.computeVolatilitySeverity(volatilityScore);
  const volatilityTrend = await volatilityService.computeVolatilityTrend(ownerId);

  const volatilitySnapshot = await prisma.volatilitySnapshot.create({
    data: {
      ownerId,
      incomeVolatility,
      balanceVolatility,
      cashflowVolatility,
      score: volatilityScore,
      severity: volatilitySeverity,
      trend: volatilityTrend,
      timestamp: new Date(),
    },
  });

  results.volatility = volatilitySnapshot;

  // 9. BEHAVIOR PIPELINE
  const transactions = bankSnap?.transactions || [];
  const spending = behaviorService.analyzeSpendingBehavior(transactions);
  const deposits = behaviorService.analyzeDepositBehavior(transactions);
  const behaviorFraud = behaviorService.detectBehaviorFraudPatterns(spending, deposits);
  const behaviorRiskScore = behaviorService.computeBehaviorRiskScore(spending, deposits, behaviorFraud);
  const behaviorSeverity = behaviorService.computeBehaviorSeverity(behaviorRiskScore);
  const behaviorTrend = await behaviorService.computeBehaviorTrend(ownerId);

  const behaviorSnapshot = await prisma.behaviorSnapshot.create({
    data: {
      ownerId,
      spending,
      deposits,
      fraudPatterns: behaviorFraud,
      riskScore: behaviorRiskScore,
      severity: behaviorSeverity,
      trend: behaviorTrend,
      timestamp: new Date(),
    },
  });

  results.behavior = behaviorSnapshot;

  // 10. GLOBAL FRAUD PIPELINE
  const verificationSnap = await prisma.verificationSnapshot.findFirst({
    where: { ownerId },
    orderBy: { timestamp: "desc" },
  });

  const fraudSignals = fraudService.aggregateFraudSignals({
    verification: verificationSnap,
    checks: checkSnap,
    income: incomeSnap,
    bank: bankSnap,
    cashflow: results.cashflow,
    credit: results.credit,
  });

  const fraudCorrelations = fraudService.correlateFraudPatterns({
    verification: verificationSnap,
    checks: checkSnap,
    income: incomeSnap,
    bank: bankSnap,
    cashflow: results.cashflow,
    credit: results.credit,
  });

  const fraudScore = fraudService.computeGlobalFraudScore({
    signals: fraudSignals,
    correlations: fraudCorrelations,
  });

  const fraudSeverity = fraudService.computeGlobalFraudSeverity(fraudScore);
  const fraudTrend = await fraudService.computeGlobalFraudTrend(ownerId);

  const fraudSnapshot = await prisma.fraudSnapshot.create({
    data: {
      ownerId,
      signals: fraudSignals,
      correlations: fraudCorrelations,
      score: fraudScore,
      severity: fraudSeverity,
      trend: fraudTrend,
      timestamp: new Date(),
    },
  });

  results.fraud = fraudSnapshot;

  // 11. GLOBAL RISK PIPELINE
  const subsystemScores = riskService.aggregateSubsystemScores({
    verification: verificationSnap,
    fraud: fraudSnapshot,
    volatility: volatilitySnapshot,
    behavior: behaviorSnapshot,
    income: incomeSnap,
    bank: bankSnap,
    cashflow: results.cashflow,
    checks: checkSnap,
    ach: achSnap,
    credit: results.credit,
    dti: results.dti,
  });

  const globalRiskScore = riskService.computeGlobalRiskScore(subsystemScores);
  const globalRiskSeverity = riskService.computeGlobalRiskSeverity(globalRiskScore);
  const globalRiskTrend = await riskService.computeGlobalRiskTrend(ownerId);

  const riskSnapshot = await prisma.riskSnapshot.create({
    data: {
      ownerId,
      scores: subsystemScores,
      globalScore: globalRiskScore,
      severity: globalRiskSeverity,
      trend: globalRiskTrend,
      timestamp: new Date(),
    },
  });

  results.risk = riskSnapshot;

  return results;
}

module.exports = {
  runFullOwnerPipeline,
};
