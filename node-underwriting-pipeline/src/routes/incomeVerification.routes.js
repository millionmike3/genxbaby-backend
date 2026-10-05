// genxbaby-backend/src/routes/incomeVerification.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const upload = multer({ dest: "uploads/" });

const {
  runIncomeVerificationOCR,
  extractIncomeData,
  computeIncomeVerificationScore,
} = require("../services/incomeVerificationService");

/**
 * POST /income-verification/:ownerId/upload
 * Uploads income documents (paystubs, W2, 1099, bank statements)
 * Runs OCR → extracts income data → computes verification score → saves snapshot
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
    const ocrText = await runIncomeVerificationOCR(req.file.path);

    // Step 2: Extract structured income data
    const extracted = extractIncomeData(ocrText);

    // Step 3: Compute verification score
    const score = computeIncomeVerificationScore(extracted);

    // Step 4: Save snapshot
    const snapshot = await prisma.incomeVerificationSnapshot.create({
      data: {
        ownerId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        ocrText,
        extractedFields: extracted,
        incomeVerificationScore: score,
        timestamp: new Date(),
      },
    });

    res.json({
      ownerId,
      snapshot,
    });
  } catch (err) {
    console.error("Income Verification Upload Error:", err);
    res.status(500).json({ error: "Failed to process income verification document" });
  }
});

/**
 * GET /income-verification/:ownerId
 * Returns latest income verification score + extracted fields
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

    const latest = await prisma.incomeVerificationSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.json({
        ownerId,
        incomeVerificationScore: null,
        extractedFields: null,
        timestamp: null,
      });
    }

    res.json({
      ownerId,
      incomeVerificationScore: latest.incomeVerificationScore,
      extractedFields: latest.extractedFields,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("Income Verification Fetch Error:", err);
    res.status(500).json({ error: "Failed to load income verification data" });
  }
});

/**
 * GET /income-verification/:ownerId/history
 * Returns full income verification history for an owner
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

    const history = await prisma.incomeVerificationSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("Income Verification History Error:", err);
    res.status(500).json({ error: "Failed to load income verification history" });
  }
});

module.exports = router;
