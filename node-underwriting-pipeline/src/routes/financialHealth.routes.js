// genxbaby-backend/src/routes/financialHealth.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  computeFinancialHealthScore,
} = require("../services/financialHealthService");

/**
 * GET /financial-health/:ownerId
 * Returns the owner's financial health score + components
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

    // Compute financial health
    const health = await computeFinancialHealthScore(ownerId);

    res.json({
      ownerId,
      financialHealthScore: health.score,
      components: health.components,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Financial Health Error:", err);
    res.status(500).json({ error: "Failed to load financial health" });
  }
});

/**
 * GET /financial-health/:ownerId/history
 * Returns historical financial health snapshots
 */
router.get("/:ownerId/history", async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Ensure owner exists
    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const history = await prisma.financialHealthSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("Financial Health History Error:", err);
    res.status(500).json({ error: "Failed to load financial health history" });
  }
});

/**
 * POST /financial-health/:ownerId/evaluate
 * Forces a new financial health evaluation + snapshot
 */
router.post("/:ownerId/evaluate", async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Ensure owner exists
    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Compute financial health
    const health = await computeFinancialHealthScore(ownerId);

    // Save snapshot
    const snapshot = await prisma.financialHealthSnapshot.create({
      data: {
        ownerId,
        financialHealthScore: health.score,
        components: health.components,
        timestamp: new Date(),
      },
    });

    res.json({
      ownerId,
      snapshot,
    });
  } catch (err) {
    console.error("Financial Health Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate financial health" });
  }
});

module.exports = router;
