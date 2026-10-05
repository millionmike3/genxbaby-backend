// genxbaby-backend/src/routes/aml.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  runAMLMonitoring,
  computeAMLRedFlags,
  computeAMLScore,
  computeAMLSeverity,
  computeAMLNarrative,
  computeAMLTrend,
} = require("../services/amlService");

/**
 * GET /aml/:ownerId
 * Returns AML monitoring results + red flags + score + severity + narrative + trend
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

    // Run AML monitoring (transactions, deposits, withdrawals, checks, ACH)
    const monitoring = await runAMLMonitoring(ownerId);

    // Red flags (structuring, rapid movement, high-risk jurisdictions, unusual patterns)
    const redFlags = computeAMLRedFlags(monitoring);

    // AML score (0–100)
    const score = computeAMLScore(redFlags);

    // Severity (LOW, MEDIUM, HIGH, CRITICAL)
    const severity = computeAMLSeverity(score);

    // Narrative (SAR-style AML explanation)
    const narrative = computeAMLNarrative({
      owner,
      monitoring,
      redFlags,
      score,
      severity,
    });

    // Trend (improving, stable, worsening)
    const trend = await computeAMLTrend(ownerId);

    res.json({
      ownerId,
      monitoring,
      redFlags,
      score,
      severity,
      narrative,
      trend,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("AML Fetch Error:", err);
    res.status(500).json({ error: "Failed to compute AML metrics" });
  }
});

/**
 * GET /aml/:ownerId/history
 * Returns AML history for an owner
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

    const history = await prisma.amlSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("AML History Error:", err);
    res.status(500).json({ error: "Failed to load AML history" });
  }
});

/**
 * POST /aml/:ownerId/evaluate
 * Forces a new AML evaluation + snapshot
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

    // Run AML monitoring
    const monitoring = await runAMLMonitoring(ownerId);

    // Red flags
    const redFlags = computeAMLRedFlags(monitoring);

    // Score
    const score = computeAMLScore(redFlags);

    // Severity
    const severity = computeAMLSeverity(score);

    // Narrative
    const narrative = computeAMLNarrative({
      owner,
      monitoring,
      redFlags,
      score,
      severity,
    });

    // Trend
    const trend = await computeAMLTrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.amlSnapshot.create({
      data: {
        ownerId,
        monitoring,
        redFlags,
        score,
        severity,
        narrative,
        trend,
        timestamp: new Date(),
      },
    });

    res.json({
      ownerId,
      snapshot,
    });
  } catch (err) {
    console.error("AML Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate AML metrics" });
  }
});

module.exports = router;
