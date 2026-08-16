// genxbaby-backend/src/routes/pep.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  runPEPScreening,
  computePEPRiskScore,
  computePEPSeverity,
  computePEPNarrative,
  computePEPTrend,
} = require("../services/pepService");

/**
 * GET /pep/:ownerId
 * Returns PEP screening results + risk score + severity + narrative + trend
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

    // Run PEP screening (global political exposure databases)
    const screening = await runPEPScreening(owner);

    // Risk score (0–100)
    const riskScore = computePEPRiskScore(screening);

    // Severity (LOW, MEDIUM, HIGH, CRITICAL)
    const severity = computePEPSeverity(screening);

    // Narrative (AML-style explanation)
    const narrative = computePEPNarrative(screening);

    // Trend (improving, stable, worsening)
    const trend = await computePEPTrend(ownerId);

    res.json({
      ownerId,
      screening,
      riskScore,
      severity,
      narrative,
      trend,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("PEP Fetch Error:", err);
    res.status(500).json({ error: "Failed to compute PEP metrics" });
  }
});

/**
 * GET /pep/:ownerId/history
 * Returns PEP screening history for an owner
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

    const history = await prisma.pepSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("PEP History Error:", err);
    res.status(500).json({ error: "Failed to load PEP history" });
  }
});

/**
 * POST /pep/:ownerId/evaluate
 * Forces a new PEP evaluation + snapshot
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

    // Run PEP screening
    const screening = await runPEPScreening(owner);

    // Risk score
    const riskScore = computePEPRiskScore(screening);

    // Severity
    const severity = computePEPSeverity(screening);

    // Narrative
    const narrative = computePEPNarrative(screening);

    // Trend
    const trend = await computePEPTrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.pepSnapshot.create({
      data: {
        ownerId,
        screening,
        riskScore,
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
    console.error("PEP Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate PEP metrics" });
  }
});

module.exports = router;
