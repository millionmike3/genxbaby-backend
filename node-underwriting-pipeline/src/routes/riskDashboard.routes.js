// genxbaby-backend/src/routes/riskDashboard.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { getRiskDashboard } = require("../services/riskDashboardService");

/**
 * Get full risk dashboard for an owner
 * GET /risk/dashboard/:ownerId
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

    // Build dashboard
    const dashboard = await getRiskDashboard(ownerId);

    res.json({
      ownerId,
      dashboard,
    });
  } catch (err) {
    console.error("Risk Dashboard Error:", err);
    res.status(500).json({ error: "Failed to load risk dashboard" });
  }
});

module.exports = router;
