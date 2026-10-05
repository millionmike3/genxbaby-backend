// genxbaby-backend/src/routes/checks.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ocrService = require("../services/ocrService");
const checksService = require("../services/checksService");

/**
 * POST /checks/:ownerId/upload
 * Upload → OCR → MICR → fields → fraud → risk → snapshot
 */
router.post("/:ownerId/upload", upload.single("file"), async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Validate owner
    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // 1. OCR
    const ocrText = await ocrService.runGenericOCR(req.file.path);
    const cleanedText = ocrService.cleanOCRText(ocrText);

    // 2. Extract MICR line (routing, account, check number)
    const micr = checksService.extractMICR(cleanedText);

    // 3. Extract check fields (amount, issuer, payee, date)
    const fields = checksService.extractCheckFields(cleanedText);

    // 4. Fraud patterns
    const fraudPatterns = checksService.detectCheckFraudPatterns({
      micr,
      fields,
    });

    // 5. Risk score
    const riskScore = checksService.computeCheckRiskScore({
      micr,
      fields,
      fraudPatterns,
    });

    // 6. Severity
    const severity = checksService.computeCheckSeverity(riskScore);

    // 7. Trend
    const trend = await checksService.computeCheckTrend(ownerId);

    // 8. Save snapshot
    const snapshot = await prisma.checkSnapshot.create({
      data: {
        ownerId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        ocrText,
        micr,
        fields,
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
    console.error("Check Upload Error:", err);
    res.status(500).json({ error: "Failed to process check document" });
  }
});

/**
 * GET /checks/:ownerId
 * Returns latest check snapshot
 */
router.get("/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const latest = await prisma.checkSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.json({
        ownerId,
        micr: null,
        fields: null,
        fraudPatterns: null,
        riskScore: null,
        severity: null,
        trend: null,
        timestamp: null,
      });
    }

    res.json({
      ownerId,
      micr: latest.micr,
      fields: latest.fields,
      fraudPatterns: latest.fraudPatterns,
      riskScore: latest.riskScore,
      severity: latest.severity,
      trend: latest.trend,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("Check Fetch Error:", err);
    res.status(500).json({ error: "Failed to load check data" });
  }
});

/**
 * GET /checks/:ownerId/history
 * Returns full check history
 */
router.get("/:ownerId/history", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const history = await prisma.checkSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({ ownerId, history });
  } catch (err) {
    console.error("Check History Error:", err);
    res.status(500).json({ error: "Failed to load check history" });
  }
});

/**
 * POST /checks/:ownerId/evaluate
 * Recomputes check risk using latest snapshot → saves new snapshot
 */
router.post("/:ownerId/evaluate", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const latest = await prisma.checkSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.status(400).json({
        error: "No check documents uploaded yet",
      });
    }

    // Recompute fraud patterns
    const fraudPatterns = checksService.detectCheckFraudPatterns({
      micr: latest.micr,
      fields: latest.fields,
    });

    // Recompute risk score
    const riskScore = checksService.computeCheckRiskScore({
      micr: latest.micr,
      fields: latest.fields,
      fraudPatterns,
    });

    // Recompute severity
    const severity = checksService.computeCheckSeverity(riskScore);

    // Trend
    const trend = await checksService.computeCheckTrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.checkSnapshot.create({
      data: {
        ownerId,
        fileName: latest.fileName,
        filePath: latest.filePath,
        ocrText: latest.ocrText,
        micr: latest.micr,
        fields: latest.fields,
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
    console.error("Check Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate check metrics" });
  }
});

module.exports = router;
