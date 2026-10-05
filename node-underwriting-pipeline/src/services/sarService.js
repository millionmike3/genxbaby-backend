// genxbaby-backend/src/services/sarService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Import pure SAR severity engine (pricing engine microservice)
const { computeSarSeverity: computeSarSeverityEngine } =
  require("gx_pricing_engine/src/services/sarSeverityService");

/**
 * ---------------------------------------------------------
 *  SECTION 1 — YOUR ORIGINAL SAR LOGIC (AGGREGATED FLAGS)
 * ---------------------------------------------------------
 * This creates SARs based on fraud flags generated during
 * check evaluation. This MUST remain — it powers compliance.
 */

function computeSarSeverity(flags) {
  let score = 0;

  for (const f of flags) {
    if (f.severity === "HIGH") score += 3;
    if (f.severity === "MEDIUM") score += 2;
    if (f.severity === "LOW") score += 1;
  }

  if (score >= 5) return "CRITICAL";
  if (score >= 3) return "HIGH";
  if (score >= 2) return "MEDIUM";
  return "LOW";
}

async function createSarForFlags(checkId, flags) {
  if (!flags.length) return null;

  const severity = computeSarSeverity(flags);
  const summary = `SAR generated from ${flags.length} fraud flags. Severity: ${severity}.`;

  const sar = await prisma.suspiciousActivityReport.create({
    data: {
      checkId,
      flagId: flags[0].flag.id,
      severity,
      type: "AGGREGATED_FLAGS",
      summary,
    },
  });

  return sar;
}

/**
 * ---------------------------------------------------------
 *  SECTION 2 — NEW SAR SEVERITY ENGINE WRAPPER (RISK ENGINE)
 * ---------------------------------------------------------
 * This produces a SAR severity level (1–5) for risk scoring.
 * It DOES NOT replace your fraud-flag SAR logic.
 * It simply reads aggregated SAR stats and converts them
 * into a normalized severity using computeSarSeverityEngine().
 */

async function getSarSeverity(ownerId) {
  const stats = await prisma.sarStats.findUnique({
    where: { ownerId },
  });

  const signals = {
    largeTransactions: stats?.largeTransactions || 0,
    unusualActivityFlags: stats?.unusualActivityFlags || 0,
    structuringFlags: stats?.structuringFlags || 0,
    highRiskCounterparties: stats?.highRiskCounterparties || 0,
    anomalyScore: stats?.anomalyScore || 0,
  };

  // Convert raw signals → severity (1–5)
  return computeSarSeverityEngine(signals);
}

module.exports = {
  computeSarSeverity,
  createSarForFlags,
  getSarSeverity,
};
