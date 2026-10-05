// genxbaby-backend/src/routes/fraud.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  computeFraudSignals,
  computeFraudAnomalies,
  computeFraudScore,
  computeFraudSeverity,
  computeFraudTrend,
} = require("../services/fraudService");

/**
 * GET /fraud/:ownerId
 * Returns fraud signals + anomalies + score + severity + trend
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

    // Fraud signals (behavioral, transactional, device, velocity)
    const signals = await computeFraudSignals(ownerId);

    // Anomalies (outliers, mismatches, suspicious patterns)
    const anomalies = await computeFraudAnomalies(ownerId);

    // Fraud score (0–100)
    const score = computeFraudScore({
      signals,
      anomalies,
    });

    // Severity (LOW, MEDIUM, HIGH, CRITICAL)
    const severity = computeFraudSeverity(score);

    // Trend (improving, stable, worsening)
    const trend = await computeFraudTrend(ownerId);

    res.json({
      ownerId,
      signals,
      anomalies,
      score,
      severity,
      trend,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Fraud Fetch Error:", err);
    res.status(500).json({ error: "Failed to compute fraud metrics" });
  }
});

/**
 * GET /fraud/:ownerId/history
 * Returns fraud history for an owner
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

    const history = await prisma.fraudSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("Fraud History Error:", err);
    res.status(500).json({ error: "Failed to load fraud history" });
  }
});

/**
 * POST /fraud/:ownerId/evaluate
 * Forces a new fraud evaluation + snapshot
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

    // Fraud signals
    const signals = await computeFraudSignals(ownerId);

    // Anomalies
    const anomalies = await computeFraudAnomalies(ownerId);

    // Score
    const score = computeFraudScore({
      signals,
      anomalies,
    });

    // Severity
    const severity = computeFraudSeverity(score);

    // Trend
    const trend = await computeFraudTrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.fraudSnapshot.create({
      data: {
        ownerId,
        signals,
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
    console.error("Fraud Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate fraud metrics" });
  }
});

module.exports = router;
