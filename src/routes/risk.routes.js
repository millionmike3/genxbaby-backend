// genxbaby-backend/src/routes/risk.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  computeUnifiedRiskScore,
  computeUnifiedRiskBreakdown,
  computeUnifiedRiskSeverity,
  computeUnifiedRiskTrend,
} = require("../services/riskService");

/**
 * GET /risk/:ownerId
 * Returns unified risk score + breakdown + severity + trend
 */
router.get("/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Ensure owner exists
    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Unified risk score (0–100)
    const unifiedScore = await computeUnifiedRiskScore(ownerId);

    // Breakdown (fraud, AML, cashflow, volatility, KYC, sanctions, PEP, checks, deposits, statements)
    const breakdown = await computeUnifiedRiskBreakdown(ownerId);

    // Severity (LOW, MEDIUM, HIGH, CRITICAL)
    const severity = computeUnifiedRiskSeverity(unifiedScore);

    // Trend (improving, stable, worsening)
    const trend = await computeUnifiedRiskTrend(ownerId);

    res.json({
      ownerId,
      unifiedScore,
      breakdown,
      severity,
      trend,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Unified Risk Fetch Error:", err);
    res.status(500).json({ error: "Failed to compute unified risk metrics" });
  }
});

/**
 * GET /risk/:ownerId/history
 * Returns unified risk history for an owner
 */
router.get("/:ownerId/history", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const history = await prisma.riskSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("Unified Risk History Error:", err);
    res.status(500).json({ error: "Failed to load unified risk history" });
  }
});

/**
 * POST /risk/:ownerId/evaluate
 * Forces a new unified risk evaluation + snapshot
 */
router.post("/:ownerId/evaluate", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Unified risk score
    const unifiedScore = await computeUnifiedRiskScore(ownerId);

    // Breakdown
    const breakdown = await computeUnifiedRiskBreakdown(ownerId);

    // Severity
    const severity = computeUnifiedRiskSeverity(unifiedScore);

    // Trend
    const trend = await computeUnifiedRiskTrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.riskSnapshot.create({
      data: {
        ownerId,
        unifiedScore,
        breakdown,
        severity,
        trend,
        timestamp: new Date(),
      },
    });

    res.json({
      ownerId,
      snapshot,
    });
  } catch (err) {
    console.error("Unified Risk Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate unified risk metrics" });
  }
});

module.exports = router;
