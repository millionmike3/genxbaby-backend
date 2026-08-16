// genxbaby-backend/src/routes/sar.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  computeSARTriggers,
  computeSARSeverity,
  computeSARSummary,
  computeSARTrend,
} = require("../services/sarService");

/**
 * GET /sar/:ownerId
 * Returns SAR triggers + severity + summary + trend
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

    // SAR triggers (AML red flags)
    const triggers = await computeSARTriggers(ownerId);

    // Severity (0–100)
    const severity = await computeSARSeverity(ownerId);

    // Summary (AML narrative)
    const summary = await computeSARSummary(ownerId);

    // Trend (improving, stable, worsening)
    const trend = await computeSARTrend(ownerId);

    res.json({
      ownerId,
      triggers,
      severity,
      summary,
      trend,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("SAR Fetch Error:", err);
    res.status(500).json({ error: "Failed to compute SAR metrics" });
  }
});

/**
 * GET /sar/:ownerId/history
 * Returns SAR history for an owner
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

    const history = await prisma.sarSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("SAR History Error:", err);
    res.status(500).json({ error: "Failed to load SAR history" });
  }
});

/**
 * POST /sar/:ownerId/evaluate
 * Forces a new SAR evaluation + snapshot
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

    // SAR triggers
    const triggers = await computeSARTriggers(ownerId);

    // Severity
    const severity = await computeSARSeverity(ownerId);

    // Summary
    const summary = await computeSARSummary(ownerId);

    // Trend
    const trend = await computeSARTrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.sarSnapshot.create({
      data: {
        ownerId,
        triggers,
        severity,
        summary,
        trend,
        timestamp: new Date(),
      },
    });

    res.json({
      ownerId,
      snapshot,
    });
  } catch (err) {
    console.error("SAR Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate SAR metrics" });
  }
});

module.exports = router;
