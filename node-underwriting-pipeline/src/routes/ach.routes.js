// genxbaby-backend/src/routes/ach.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ocrService = require("../services/ocrService");
const achService = require("../services/achService");

/**
 * POST /ach/:ownerId/upload
 * Upload → OCR → ACH parsing → fraud → risk → severity → trend → snapshot
 */
router.post("/:ownerId/upload", upload.single("file"), async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Validate owner
    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // 1. OCR (works for PDF, NACHA printouts, images)
    const ocrText = await ocrService.runGenericOCR(req.file.path);
    const cleanedText = ocrService.cleanOCRText(ocrText);

    // 2. Parse ACH entries (debits, credits, reversals, returns)
    const entries = achService.parseACHEntries(cleanedText);

    // 3. Compute ACH fraud patterns
    const fraudPatterns = achService.detectACHFraudPatterns(entries);

    // 4. Compute ACH risk score
    const riskScore = achService.computeACHRiskScore({
      entries,
      fraudPatterns,
    });

    // 5. Compute severity
    const severity = achService.computeACHSeverity(riskScore);

    // 6. Compute trend
    const trend = await achService.computeACHTrend(ownerId);

    // 7. Save snapshot
    const snapshot = await prisma.achSnapshot.create({
      data: {
        ownerId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        ocrText,
        entries,
        fraudPatterns,
        riskScore,
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
    console.error("ACH Upload Error:", err);
    res.status(500).json({ error: "Failed to process ACH document" });
  }
});

/**
 * GET /ach/:ownerId
 * Returns latest ACH snapshot
 */
router.get("/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const latest = await prisma.achSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.json({
        ownerId,
        entries: null,
        fraudPatterns: null,
        riskScore: null,
        severity: null,
        trend: null,
        timestamp: null,
      });
    }

    res.json({
      ownerId,
      entries: latest.entries,
      fraudPatterns: latest.fraudPatterns,
      riskScore: latest.riskScore,
      severity: latest.severity,
      trend: latest.trend,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("ACH Fetch Error:", err);
    res.status(500).json({ error: "Failed to load ACH data" });
  }
});

/**
 * GET /ach/:ownerId/history
 * Returns full ACH history
 */
router.get("/:ownerId/history", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const history = await prisma.achSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({ ownerId, history });
  } catch (err) {
    console.error("ACH History Error:", err);
    res.status(500).json({ error: "Failed to load ACH history" });
  }
});

/**
 * POST /ach/:ownerId/evaluate
 * Recomputes ACH risk using latest snapshot → saves new snapshot
 */
router.post("/:ownerId/evaluate", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const latest = await prisma.achSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.status(400).json({
        error: "No ACH documents uploaded yet",
      });
    }

    // Recompute fraud patterns
    const fraudPatterns = achService.detectACHFraudPatterns(latest.entries);

    // Recompute risk score
    const riskScore = achService.computeACHRiskScore({
      entries: latest.entries,
      fraudPatterns,
    });

    // Recompute severity
    const severity = achService.computeACHSeverity(riskScore);

    // Trend
    const trend = await achService.computeACHTrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.achSnapshot.create({
      data: {
        ownerId,
        fileName: latest.fileName,
        filePath: latest.filePath,
        ocrText: latest.ocrText,
        entries: latest.entries,
        fraudPatterns,
        riskScore,
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
    console.error("ACH Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate ACH metrics" });
  }
});

module.exports = router;
