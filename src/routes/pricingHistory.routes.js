// genxbaby-backend/src/routes/pricingHistory.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * GET /pricing/:ownerId/history
 * Returns pricing decision history for an owner
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

    // Load pricing decisions
    const history = await prisma.pricingDecision.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("Pricing History Error:", err);
    res.status(500).json({ error: "Failed to load pricing history" });
  }
});

module.exports = router;
