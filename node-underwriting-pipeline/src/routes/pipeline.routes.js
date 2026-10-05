// genxbaby-backend/src/routes/pipeline.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const pipelineOrchestratorService = require("../services/pipelineOrchestratorService");
const fraudService = require("../services/fraudService");
const riskService = require("../services/riskService");
const volatilityService = require("../services/volatilityService");
const behaviorService = require("../services/behaviorService");
const verificationService = require("../services/verificationService");

/**
 * GET /pipeline/:ownerId/summary
 * Returns latest snapshots + global risk/fraud/volatility/behavior
 */
router.get("/:ownerId/summary", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const [
      incomeSnap,
      bankSnap,
      cashflowSnap,
      creditSnap,
      dtiSnap,
      checkSnap,
      achSnap,
      verificationSnap,
      fraudSnap,
      riskSnap,
      volatilitySnap,
      behaviorSnap,
    ] = await Promise.all([
      prisma.incomeSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.bankSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.cashflowSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.creditSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.dtiSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.checkSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.achSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.verificationSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.fraudSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.riskSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.volatilitySnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
      prisma.behaviorSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
    ]);

    res.json({
      ownerId,
      income: incomeSnap || null,
      bank: bankSnap || null,
      cashflow: cashflowSnap || null,
      credit: creditSnap || null,
      dti: dtiSnap || null,
      checks: checkSnap || null,
      ach: achSnap || null,
      verification: verificationSnap || null,
      fraud: fraudSnap || null,
      risk: riskSnap || null,
      volatility: volatilitySnap || null,
      behavior: behaviorSnap || null,
    });
  } catch (err) {
    console.error("Pipeline Summary Error:", err);
    res.status(500).json({ error: "Failed to load pipeline summary" });
  }
});

/**
 * POST /pipeline/:ownerId/run
 * Runs full underwriting pipeline → saves all top-level snapshots → returns unified result
 */
router.post("/:ownerId/run", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    // 1. Run core pipeline (income, bank, cashflow, credit, dti, checks, ach)
    const coreResult = await pipelineOrchestratorService.runPipeline(ownerId);

    // 2. VERIFICATION
    const identityIssues = verificationService.verifyIdentity({
      ssn: coreResult.credit?.ssn,
      name: coreResult.income?.name,
      employer: coreResult.income?.employer,
      incomeFields: coreResult.income?.fields,
      creditTradelines: coreResult.credit,
    });

    const incomeIssues = verificationService.verifyIncome({
      incomeFields: coreResult.income?.fields,
    });

    const bankIssues = verificationService.verifyBank({
      bankFields: coreResult.bank?.fields,
      balances: coreResult.bank?.balances,
      transactions: coreResult.bank?.transactions,
    });

    const checkIssues = verificationService.verifyChecks({
      micr: coreResult.checks?.micr,
      fields: coreResult.checks?.fields,
    });

    const achIssues = verificationService.verifyACH({
      entries: coreResult.ach?.entries,
    });

    const creditIssues = verificationService.verifyCredit({
      tradelines: coreResult.credit?.tradelines,
      ssn: coreResult.credit?.ssn,
    });

    const verificationIssues = verificationService.aggregateVerification({
      identityIssues,
      incomeIssues,
      bankIssues,
      checkIssues,
      achIssues,
      creditIssues,
    });

    const verificationScore =
      verificationService.computeVerificationScore(verificationIssues);
    const verificationSeverity =
      verificationService.computeVerificationSeverity(verificationScore);
    const verificationTrend =
      await verificationService.computeVerificationTrend(ownerId);

    const verificationSnapshot = await prisma.verificationSnapshot.create({
      data: {
        ownerId,
        identityIssues,
        incomeIssues,
        bankIssues,
        checkIssues,
        achIssues,
        creditIssues,
        score: verificationScore,
        severity: verificationSeverity,
        trend: verificationTrend,
        timestamp: new Date(),
      },
    });

    // 3. FRAUD
    const fraudSignals = await fraudService.collectFraudSignals(ownerId);
    const fraudScore = fraudService.computeFraudScore(fraudSignals);
    const fraudSeverity = fraudService.computeFraudSeverity(fraudScore);
    const fraudTrend = await fraudService.computeFraudTrend(ownerId);

    const fraudSnapshot = await prisma.fraudSnapshot.create({
      data: {
        ownerId,
        signals: fraudSignals,
        score: fraudScore,
        severity: fraudSeverity,
        trend: fraudTrend,
        timestamp: new Date(),
      },
    });

    // 4. VOLATILITY
    const { series: incomeSeries, volatility: incomeVol } =
      await volatilityService.computeIncomeVolatility(ownerId);
    const { series: bankSeries, volatility: bankVol } =
      await volatilityService.computeBankVolatility(ownerId);
    const { series: cashflowSeries, volatility: cashflowVol } =
      await volatilityService.computeCashflowVolatility(ownerId);

    const volatilityScore = volatilityService.computeVolatilityScore({
      incomeVol,
      bankVol,
      cashflowVol,
    });
    const volatilitySeverity =
      volatilityService.computeVolatilitySeverity(volatilityScore);
    const volatilityTrend =
      await volatilityService.computeVolatilityTrend(ownerId);

    const volatilitySnapshot = await prisma.volatilitySnapshot.create({
      data: {
        ownerId,
        incomeSeries,
        bankSeries,
        cashflowSeries,
        incomeVol,
        bankVol,
        cashflowVol,
        score: volatilityScore,
        severity: volatilitySeverity,
        trend: volatilityTrend,
        timestamp: new Date(),
      },
    });

    // 5. BEHAVIOR
    const spending = await behaviorService.computeSpendingBehavior(ownerId);
    const deposits = await behaviorService.computeDepositBehavior(ownerId);
    const withdrawals = await behaviorService.computeWithdrawalBehavior(ownerId);
    const achBehavior = await behaviorService.computeACHBehavior(ownerId);
    const checksBehavior = await behaviorService.computeCheckBehavior(ownerId);
    const creditBehavior = await behaviorService.computeCreditBehavior(ownerId);

    const behaviorScore = behaviorService.computeBehaviorScore({
      spending,
      deposits,
      withdrawals,
      ach: achBehavior,
      checks: checksBehavior,
      credit: creditBehavior,
    });
    const behaviorSeverity =
      behaviorService.computeBehaviorSeverity(behaviorScore);
    const behaviorTrend =
      await behaviorService.computeBehaviorTrend(ownerId);

    const behaviorSnapshot = await prisma.behaviorSnapshot.create({
      data: {
        ownerId,
        spending,
        deposits,
        withdrawals,
        ach: achBehavior,
        checks: checksBehavior,
        credit: creditBehavior,
        score: behaviorScore,
        severity: behaviorSeverity,
        trend: behaviorTrend,
        timestamp: new Date(),
      },
    });

    // 6. GLOBAL RISK
    const subsystemScores = await riskService.collectSubsystemRisk(ownerId);
    const globalRiskScore =
      riskService.computeGlobalRiskScore(subsystemScores);
    const globalRiskSeverity =
      riskService.computeGlobalSeverity(globalRiskScore);
    const globalRiskTrend =
      await riskService.computeGlobalTrend(ownerId);

    const riskSnapshot = await prisma.riskSnapshot.create({
      data: {
        ownerId,
        subsystems: subsystemScores,
        score: globalRiskScore,
        severity: globalRiskSeverity,
        trend: globalRiskTrend,
        timestamp: new Date(),
      },
    });

    // 7. Unified response
    res.json({
      ownerId,
      core: coreResult,
      verification: verificationSnapshot,
      fraud: fraudSnapshot,
      volatility: volatilitySnapshot,
      behavior: behaviorSnapshot,
      risk: riskSnapshot,
    });
  } catch (err) {
    console.error("Pipeline Run Error:", err);
    res.status(500).json({ error: "Failed to run underwriting pipeline" });
  }
});

module.exports = router;
