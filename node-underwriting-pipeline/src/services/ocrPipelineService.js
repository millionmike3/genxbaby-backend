// genxbaby-backend/src/services/ocrPipelineService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const documentService = require("./documentService");
const verificationService = require("./verificationService");
const fraudService = require("./fraudService");
const riskService = require("./riskService");

/**
 * 1. Run full OCR → Document → Verification → Fraud → Risk pipeline
 */
async function runOCRPipeline(ownerId, filePath) {
  // Step 1: Ingest document + OCR
  const docSnapshot = await documentService.ingestDocument(ownerId, filePath);

  // Step 2: Document authenticity
  const docAuthenticity = documentService.evaluateDocumentAuthenticity(docSnapshot);

  // Step 3: Build document intelligence
  const docIntel = documentService.buildDocumentIntelligence(docSnapshot, docAuthenticity);

  // Step 4: Pull latest subsystem snapshots for verification
  const [income, bank, checks, cashflow] = await Promise.all([
    prisma.incomeSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
    prisma.bankSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
    prisma.checkSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
    prisma.cashflowSnapshot.findFirst({ where: { ownerId }, orderBy: { timestamp: "desc" } }),
  ]);

  // Step 5: Verification engine
  const verificationIdentity = verificationService.verifyIdentityFromDocuments({
    ocr: docSnapshot,
    doc: docSnapshot,
    income,
    bank,
    check: checks,
  });

  const verificationAuthenticity = verificationService.verifyDocumentAuthenticity({
    ocr: docSnapshot,
    doc: docSnapshot,
    income,
    check: checks,
  });

  const verificationConsistency = verificationService.computeCrossDocumentConsistency({
    ocr: docSnapshot,
    doc: docSnapshot,
    income,
    bank,
    check: checks,
  });

  const verificationFraudPatterns = verificationService.detectVerificationFraudPatterns({
    identity: verificationIdentity,
    authenticity: verificationAuthenticity,
    consistency: verificationConsistency,
  });

  const verificationScore = verificationService.computeVerificationScore({
    identity: verificationIdentity,
    authenticity: verificationAuthenticity,
    consistency: verificationConsistency,
    fraudPatterns: verificationFraudPatterns,
  });

  const verificationSeverity = verificationService.computeVerificationSeverity(verificationScore);
  const verificationTrend = await verificationService.computeVerificationTrend(ownerId);

  const verificationSnapshot = await prisma.verificationSnapshot.create({
    data: {
      ownerId,
      identity: verificationIdentity,
      authenticity: verificationAuthenticity,
      consistency: verificationConsistency,
      fraudPatterns: verificationFraudPatterns,
      score: verificationScore,
      severity: verificationSeverity,
      trend: verificationTrend,
      timestamp: new Date(),
    },
  });

  // Step 6: Fraud engine
  const fraudSignals = fraudService.aggregateFraudSignals({
    verification: verificationSnapshot,
    checks,
    income,
    bank,
    cashflow,
  });

  const fraudCorrelations = fraudService.correlateFraudPatterns({
    verification: verificationSnapshot,
    checks,
    income,
    bank,
    cashflow,
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

  // Step 7: Risk engine
  const subsystemScores = riskService.aggregateSubsystemScores({
    verification: verificationSnapshot,
    fraud: fraudSnapshot,
    volatility: await prisma.volatilitySnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    }),
    behavior: await prisma.behaviorSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    }),
    income,
    bank,
    cashflow,
    checks,
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

  // Step 8: Return full pipeline output
  return {
    document: docIntel,
    verification: verificationSnapshot,
    fraud: fraudSnapshot,
    risk: riskSnapshot,
  };
}

/**
 * 2. Fetch pipeline history for an owner
 */
async function getOCRPipelineHistory(ownerId) {
  const documents = await prisma.documentSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "desc" },
  });

  const verification = await prisma.verificationSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "desc" },
  });

  const fraud = await prisma.fraudSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "desc" },
  });

  const risk = await prisma.riskSnapshot.findMany({
    where: { ownerId },
    orderBy: { timestamp: "desc" },
  });

  return {
    documents,
    verification,
    fraud,
    risk,
  };
}

module.exports = {
  runOCRPipeline,
  getOCRPipelineHistory,
};
