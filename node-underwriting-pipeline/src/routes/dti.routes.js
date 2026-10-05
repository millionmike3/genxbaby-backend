// genxbaby-backend/src/routes/dti.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const dtiService = require("../services/dtiService");

/**
 * GET /dti/:ownerId
 * Returns latest DTI snapshot (dti + monthlyDebt + income + fraud + severity + trend)
 */
router.get("/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Validate owner
    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const latest = await prisma.dtiSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.json({
        ownerId,
        dti: null,
        monthlyDebt: null,
        grossMonthlyIncome: null,
        fraudPatterns: null,
        severity: null,
        trend: null,
        timestamp: null,
      });
    }

    res.json({
      ownerId,
      dti: latest.dti,
      monthlyDebt: latest.monthlyDebt,
      grossMonthlyIncome: latest.grossMonthlyIncome,
      fraudPatterns: latest.fraudPatterns,
      severity: latest.severity,
      trend: latest.trend,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("DTI Fetch Error:", err);
    res.status(500).json({ error: "Failed to load DTI data" });
  }
});

/**
 * GET /dti/:ownerId/history
 * Returns full DTI history for an owner
 */
router.get("/:ownerId/history", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const history = await prisma.dtiSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({ ownerId, history });
  } catch (err) {
    console.error("DTI History Error:", err);
    res.status(500).json({ error: "Failed to load DTI history" });
  }
});

/**
 * POST /dti/:ownerId/evaluate
 * Recomputes DTI using latest income + credit → saves new snapshot
 */
router.post("/:ownerId/evaluate", async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Validate owner
    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    // Pull latest credit snapshot (monthly debt)
    const creditSnap = await prisma.creditSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!creditSnap) {
      return res.status(400).json({
        error: "No credit report uploaded yet",
      });
    }

    const monthlyDebt = creditSnap.monthlyDebt || 0;

    // Pull latest income snapshot
    const incomeSnap = await prisma.incomeSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!incomeSnap) {
      return res.status(400).json({
        error: "No income documents uploaded yet",
      });
    }

    const grossMonthlyIncome =
      incomeSnap.extractedFields?.grossMonthly ||
      incomeSnap.extractedFields?.netMonthly ||
      0;

    // Compute DTI
    const dti = dtiService.computeDTI({
      monthlyDebt,
      grossMonthlyIncome,
    });

    // Fraud patterns
    const fraudPatterns = dtiService.detectDTIFraudPatterns({
      dti,
      monthlyDebt,
      grossMonthlyIncome,
    });

    // Severity
    const severity = dtiService.computeDTISeverity(dti);

    // Trend
    const trend = await dtiService.computeDTITrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.dtiSnapshot.create({
      data: {
        ownerId,
        dti,
        monthlyDebt,
        grossMonthlyIncome,
        fraudPatterns,
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
    console.error("DTI Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate DTI metrics" });
  }
});

module.exports = router;
