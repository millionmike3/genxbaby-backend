// genxbaby-backend/src/routes/checks.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const upload = multer({ dest: "uploads/" });

const {
  runCheckOCR,
  extractCheckFields,
  analyzeMICR,
  detectDuplicateChecks,
  detectAlteredChecks,
  computeCheckRiskScore,
  computeCheckSeverity,
  computeCheckTrend,
} = require("../services/checksService");

/**
 * POST /checks/:ownerId/upload
 * Uploads a check image → OCR → field extraction → MICR analysis → fraud checks → risk → snapshot
 */
router.post("/:ownerId/upload", upload.single("file"), async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Ensure owner exists
    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Step 1: OCR
    const ocrText = await runCheckOCR(req.file.path);

    // Step 2: Extract check fields (amount, date, payee, memo, signature)
    const fields = extractCheckFields(ocrText);

    // Step 3: MICR analysis (routing number, account number, check number)
    const micr = analyzeMICR(ocrText);

    // Step 4: Duplicate check detection
    const duplicates = await detectDuplicateChecks(ownerId, fields, micr);

    // Step 5: Altered check detection (amount mismatch, overwritten fields)
    const altered = detectAlteredChecks(fields, ocrText);

    // Step 6: Risk score (0–100)
    const riskScore = computeCheckRiskScore({
      fields,
      micr,
      duplicates,
      altered,
    });

    // Step 7: Severity (LOW, MEDIUM, HIGH, CRITICAL)
    const severity = computeCheckSeverity(riskScore);

    // Step 8: Save snapshot
    const snapshot = await prisma.checkSnapshot.create({
      data: {
        ownerId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        ocrText,
        fields,
        micr,
        duplicates,
        altered,
        riskScore,
        severity,
        timestamp: new Date(),
      },
    });

    res.json({
      ownerId,
      snapshot,
    });
  } catch (err) {
    console.error("Check Upload Error:", err);
    res.status(500).json({ error: "Failed to process check" });
  }
});

/**
 * GET /checks/:ownerId
 * Returns latest check snapshot
 */
router.get("/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const latest = await prisma.checkSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.json({
        ownerId,
        fields: null,
        micr: null,
        duplicates: null,
        altered: null,
        riskScore: null,
        severity: null,
        timestamp: null,
      });
    }

    res.json({
      ownerId,
      fields: latest.fields,
      micr: latest.micr,
      duplicates: latest.duplicates,
      altered: latest.altered,
      riskScore: latest.riskScore,
      severity: latest.severity,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("Check Fetch Error:", err);
    res.status(500).json({ error: "Failed to load check data" });
  }
});

/**
 * GET /checks/:ownerId/history
 * Returns full check history for an owner
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

    const history = await prisma.checkSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("Check History Error:", err);
    res.status(500).json({ error: "Failed to load check history" });
  }
});

/**
 * POST /checks/:ownerId/evaluate
 * Forces a new check evaluation + snapshot
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

    const latest = await prisma.checkSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.status(400).json({
        error: "No checks uploaded yet",
      });
    }

    // Recompute risk score
    const riskScore = computeCheckRiskScore({
      fields: latest.fields,
      micr: latest.micr,
      duplicates: latest.duplicates,
      altered: latest.altered,
    });

    // Recompute severity
    const severity = computeCheckSeverity(riskScore);

    // Trend
    const trend = await computeCheckTrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.checkSnapshot.create({
      data: {
        ownerId,
        fileName: latest.fileName,
        filePath: latest.filePath,
        ocrText: latest.ocrText,
        fields: latest.fields,
        micr: latest.micr,
        duplicates: latest.duplicates,
        altered: latest.altered,
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
