// genxbaby-backend/src/routes/behavior.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  computeSpendingPatterns,
  computeTimingSignals,
  computeBehavioralAnomalies,
  computeBehaviorScore,
  computeBehaviorSeverity,
  computeBehaviorTrend,
} = require("../services/behaviorService");

/**
 * GET /behavior/:ownerId
 * Returns behavioral patterns + timing signals + anomalies + score + severity + trend
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

    // Spending patterns (categories, ratios, lifestyle indicators)
    const patterns = await computeSpendingPatterns(ownerId);

    // Timing signals (transaction timing, day-of-week patterns, unusual hours)
    const timing = await computeTimingSignals(ownerId);

    // Behavioral anomalies (outliers, mismatches, sudden changes)
    const anomalies = await computeBehavioralAnomalies(ownerId);

    // Behavior score (0–100)
    const score = computeBehaviorScore({
      patterns,
      timing,
      anomalies,
    });

    // Severity (LOW, MEDIUM, HIGH, CRITICAL)
    const severity = computeBehaviorSeverity(score);

    // Trend (improving, stable, worsening)
    const trend = await computeBehaviorTrend(ownerId);

    res.json({
      ownerId,
      patterns,
      timing,
      anomalies,
      score,
      severity,
      trend,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Behavior Fetch Error:", err);
    res.status(500).json({ error: "Failed to compute behavioral metrics" });
  }
});

/**
 * GET /behavior/:ownerId/history
 * Returns behavioral history for an owner
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

    const history = await prisma.behaviorSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("Behavior History Error:", err);
    res.status(500).json({ error: "Failed to load behavioral history" });
  }
});

/**
 * POST /behavior/:ownerId/evaluate
 * Forces a new behavioral evaluation + snapshot
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

    // Spending patterns
    const patterns = await computeSpendingPatterns(ownerId);

    // Timing signals
    const timing = await computeTimingSignals(ownerId);

    // Behavioral anomalies
    const anomalies = await computeBehavioralAnomalies(ownerId);

    // Score
    const score = computeBehaviorScore({
      patterns,
      timing,
      anomalies,
    });

    // Severity
    const severity = computeBehaviorSeverity(score);

    // Trend
    const trend = await computeBehaviorTrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.behaviorSnapshot.create({
      data: {
        ownerId,
        patterns,
        timing,
        anomalies,
        score,
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
    console.error("Behavior Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate behavioral metrics" });
  }
});

module.exports = router;
