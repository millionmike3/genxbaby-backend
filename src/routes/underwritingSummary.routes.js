const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { getRiskDashboard } = require("../services/riskDashboardService");
const { getRiskHistory } = require("../services/riskHistoryService");
const { getPricingHistory } = require("../services/pricingDecisionService");

router.get("/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    const banks = await prisma.bankProfile.findMany({ where: { ownerId } });

    const dashboard = await getRiskDashboard(ownerId);
    const riskHistory = await getRiskHistory(ownerId);
    const pricingHistory = await getPricingHistory(ownerId);

    // Income verification snapshots
    const incomeHistory = await prisma.incomeVerificationSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    const latestIncome = incomeHistory[0] || null;

    res.json({
      owner,
      dashboard,
      riskHistory,
      pricingHistory,
      banks,
      incomeVerification: latestIncome,
    });
  } catch (err) {
    console.error("Underwriting Summary Error:", err);
    res.status(500).json({ error: "Failed to load underwriting summary" });
  }
});

module.exports = router;
