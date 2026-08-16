// genxbaby-backend/src/routes/riskTier.routes.js

const express = require("express");
const router = express.Router();

const { determineRiskTier, tierMarginAdjustment } =
  require("../services/riskTierService");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * GET /risk/tier/:ownerId
 * Returns the owner's current tier + margin adjustment
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

    // Load latest risk snapshot
    const latestSnapshot = await prisma.riskSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latestSnapshot) {
      return res.status(404).json({
        error: "No risk snapshots found for this owner",
      });
    }

    // Compute tier
    const tier = determineRiskTier(latestSnapshot.riskScore);

    // Compute tier margin adjustment
    const tierAdjustmentBps = tierMarginAdjustment(tier);

    res.json({
      ownerId,
      tier,
      tierAdjustmentBps,
      riskScore: latestSnapshot.riskScore,
      timestamp: latestSnapshot.timestamp,
    });
  } catch (err) {
    console.error("Risk Tier Error:", err);
    res.status(500).json({ error: "Failed to load risk tier" });
  }
});

module.exports = router;
