// genxbaby-backend/src/routes/deposit.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  computeDepositFraudScore,
  computeDepositRiskScore,
  extractDepositPatterns,
} = require("../services/depositService");

/**
 * GET /deposits/:ownerId
 * Returns deposit fraud score + risk score + patterns
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

    // Deposit fraud score (counterfeit, repeated reversals, suspicious velocity)
    const fraudScore = await computeDepositFraudScore(ownerId);

    // Deposit risk score (NSFs, overdrafts, volatility, anomalies)
    const riskScore = await computeDepositRiskScore(ownerId);

    // Deposit patterns (recurring payroll, cash deposits, suspicious flows)
    const patterns = await extractDepositPatterns(ownerId);

    res.json({
      ownerId,
      depositFraudScore: fraudScore,
      depositRiskScore: riskScore,
      patterns,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Deposit Fetch Error:", err);
    res.status(500).json({ error: "Failed to compute deposit metrics" });
  }
});

/**
 * GET /deposits/:ownerId/history
 * Returns deposit history for an owner
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

    const history = await prisma.depositSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("Deposit History Error:", err);
    res.status(500).json({ error: "Failed to load deposit history" });
  }
});

/**
 * POST /deposits/:ownerId/evaluate
 * Forces a new deposit evaluation + snapshot
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

    // Deposit fraud score
    const fraudScore = await computeDepositFraudScore(ownerId);

    // Deposit risk score
    const riskScore = await computeDepositRiskScore(ownerId);

    // Deposit patterns
    const patterns = await extractDepositPatterns(ownerId);

    // Save snapshot
    const snapshot = await prisma.depositSnapshot.create({
      data: {
        ownerId,
        depositFraudScore: fraudScore,
        depositRiskScore: riskScore,
        patterns,
        timestamp: new Date(),
      },
    });

    res.json({
      ownerId,
      snapshot,
    });
  } catch (err) {
    console.error("Deposit Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate deposit metrics" });
  }
});

module.exports = router;
