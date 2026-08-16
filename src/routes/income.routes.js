// genxbaby-backend/src/routes/income.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const upload = multer({ dest: "uploads/" });

const {
  runPaystubOCR,
  extractIncomeFields,
  computeEmployerConsistency,
  computeIncomeStability,
  computeIncomeRiskScore,
  computeIncomeSeverity,
  computeIncomeTrend,
} = require("../services/incomeService");

/**
 * POST /income/:ownerId/upload
 * Uploads a paystub → OCR → field extraction → employer consistency → stability → risk → snapshot
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
    const ocrText = await runPaystubOCR(req.file.path);

    // Step 2: Extract structured income fields (gross, net, YTD, employer, pay period)
    const extracted = extractIncomeFields(ocrText);

    // Step 3: Employer consistency (name match, EIN match, formatting consistency)
    const employerConsistency = computeEmployerConsistency(extracted);

    // Step 4: Income stability (variance, pay frequency, YTD alignment)
    const stability = computeIncomeStability(extracted);

    // Step 5: Risk score (0–100)
    const riskScore = computeIncomeRiskScore({
      extracted,
      employerConsistency,
      stability,
    });

    // Step 6: Severity (LOW, MEDIUM, HIGH, CRITICAL)
    const severity = computeIncomeSeverity(riskScore);

    // Step 7: Save snapshot
    const snapshot = await prisma.incomeSnapshot.create({
      data: {
        ownerId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        ocrText,
        extractedFields: extracted,
        employerConsistency,
        stability,
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
    console.error("Income Upload Error:", err);
    res.status(500).json({ error: "Failed to process income document" });
  }
});

/**
 * GET /income/:ownerId
 * Returns latest income snapshot (fields + consistency + stability + risk + severity)
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

    const latest = await prisma.incomeSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.json({
        ownerId,
        extractedFields: null,
        employerConsistency: null,
        stability: null,
        riskScore: null,
        severity: null,
        timestamp: null,
      });
    }

    res.json({
      ownerId,
      extractedFields: latest.extractedFields,
      employerConsistency: latest.employerConsistency,
      stability: latest.stability,
      riskScore: latest.riskScore,
      severity: latest.severity,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("Income Fetch Error:", err);
    res.status(500).json({ error: "Failed to load income data" });
  }
});

/**
 * GET /income/:ownerId/history
 * Returns full income history for an owner
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

    const history = await prisma.incomeSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("Income History Error:", err);
    res.status(500).json({ error: "Failed to load income history" });
  }
});

/**
 * POST /income/:ownerId/evaluate
 * Forces a new income evaluation + snapshot
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

    const latest = await prisma.incomeSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.status(400).json({
        error: "No income documents uploaded yet",
      });
    }

    // Recompute employer consistency
    const employerConsistency = computeEmployerConsistency(
      latest.extractedFields
    );

    // Recompute stability
    const stability = computeIncomeStability(latest.extractedFields);

    // Recompute risk score
    const riskScore = computeIncomeRiskScore({
      extracted: latest.extractedFields,
      employerConsistency,
      stability,
    });

    // Recompute severity
    const severity = computeIncomeSeverity(riskScore);

    // Trend (improving, stable, worsening)
    const trend = await computeIncomeTrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.incomeSnapshot.create({
      data: {
        ownerId,
        fileName: latest.fileName,
        filePath: latest.filePath,
        ocrText: latest.ocrText,
        extractedFields: latest.extractedFields,
        employerConsistency,
        stability,
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
    console.error("Income Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate income metrics" });
  }
});

module.exports = router;
