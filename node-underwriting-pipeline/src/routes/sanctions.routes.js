// genxbaby-backend/src/routes/sanctions.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  runSanctionsScreening,
  computeSanctionsRisk,
  computeSanctionsSeverity,
  computeSanctionsNarrative,
  computeSanctionsTrend,
} = require("../services/sanctionsService");

/**
 * GET /sanctions/:ownerId
 * Returns sanctions screening results + risk + severity + narrative + trend
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

    // Run sanctions screening (OFAC, UN, EU, PEP, adverse media)
    const screening = await runSanctionsScreening(owner);

    // Risk score (0–100)
    const risk = computeSanctionsRisk(screening);

    // Severity (LOW, MEDIUM, HIGH, CRITICAL)
    const severity = computeSanctionsSeverity(screening);

    // Narrative (AML-style explanation)
    const narrative = computeSanctionsNarrative(screening);

    // Trend (improving, stable, worsening)
    const trend = await computeSanctionsTrend(ownerId);

    res.json({
      ownerId,
      screening,
      risk,
      severity,
      narrative,
      trend,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Sanctions Fetch Error:", err);
    res.status(500).json({ error: "Failed to compute sanctions metrics" });
  }
});

/**
 * GET /sanctions/:ownerId/history
 * Returns sanctions history for an owner
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

    const history = await prisma.sanctionsSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("Sanctions History Error:", err);
    res.status(500).json({ error: "Failed to load sanctions history" });
  }
});

/**
 * POST /sanctions/:ownerId/evaluate
 * Forces a new sanctions evaluation + snapshot
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

    // Run sanctions screening
    const screening = await runSanctionsScreening(owner);

    // Risk score
    const risk = computeSanctionsRisk(screening);

    // Severity
    const severity = computeSanctionsSeverity(screening);

    // Narrative
    const narrative = computeSanctionsNarrative(screening);

    // Trend
    const trend = await computeSanctionsTrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.sanctionsSnapshot.create({
      data: {
        ownerId,
        screening,
        risk,
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
    console.error("Sanctions Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate sanctions metrics" });
  }
});

module.exports = router;
