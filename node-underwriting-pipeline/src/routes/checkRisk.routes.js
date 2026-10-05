// genxbaby-backend/src/routes/checkRisk.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { computeCheckRisk } = require("../services/checkRiskService");

/**
 * GET /checks/:checkId/risk
 * Returns risk evaluation for a specific check
 */
router.get("/:checkId/risk", async (req, res) => {
  try {
    const { checkId } = req.params;

    // Ensure check exists
    const check = await prisma.check.findUnique({
      where: { id: checkId },
    });

    if (!check) {
      return res.status(404).json({ error: "Check not found" });
    }

    // Compute risk
    const risk = await computeCheckRisk(checkId);

    res.json({
      checkId,
      risk,
    });
  } catch (err) {
    console.error("Check Risk Error:", err);
    res.status(500).json({ error: "Failed to compute check risk" });
  }
});

/**
 * GET /checks/:ownerId/list
 * Returns all checks for an owner with latest risk snapshot
 */
router.get("/:ownerId/list", async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Ensure owner exists
    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Load checks
    const checks = await prisma.check.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
    });

    // Attach latest risk snapshot for each check
    const enriched = [];
    for (const c of checks) {
      const snap = await prisma.checkRiskSnapshot.findFirst({
        where: { checkId: c.id },
        orderBy: { timestamp: "desc" },
      });

      enriched.push({
        ...c,
        latestRisk: snap || null,
      });
    }

    res.json({
      ownerId,
      checks: enriched,
    });
  } catch (err) {
    console.error("Check List Error:", err);
    res.status(500).json({ error: "Failed to load checks" });
  }
});

/**
 * POST /checks/:checkId/evaluate
 * Forces a new risk evaluation for a check
 */
router.post("/:checkId/evaluate", async (req, res) => {
  try {
    const { checkId } = req.params;

    // Ensure check exists
    const check = await prisma.check.findUnique({
      where: { id: checkId },
    });

    if (!check) {
      return res.status(404).json({ error: "Check not found" });
    }

    // Compute risk
    const risk = await computeCheckRisk(checkId);

    // Save snapshot
    const snapshot = await prisma.checkRiskSnapshot.create({
      data: {
        checkId,
        riskScore: risk.riskScore,
        fraudScore: risk.fraudScore,
        sarSeverity: risk.sarSeverity,
        volatilityIndex: risk.volatilityIndex,
        behaviorScore: risk.behaviorScore,
        bankRiskScore: risk.bankRiskScore,
        timestamp: new Date(),
      },
    });

    res.json({
      checkId,
      snapshot,
    });
  } catch (err) {
    console.error("Check Risk Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate check risk" });
  }
});

module.exports = router;
