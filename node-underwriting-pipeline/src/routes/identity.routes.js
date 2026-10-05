// genxbaby-backend/src/routes/identity.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const upload = multer({ dest: "uploads/" });

const {
  runIdentityOCR,
  extractIdentityFields,
  computeIdentityConfidenceScore,
} = require("../services/identityService");

const {
  runSanctionsScreening,
  computeSanctionsRisk,
} = require("../services/sanctionsService");

/**
 * POST /identity/:ownerId/upload
 * Uploads identity documents → OCR → extraction → confidence scoring → sanctions screening → snapshot
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
    const ocrText = await runIdentityOCR(req.file.path);

    // Step 2: Extract structured identity fields
    const extracted = extractIdentityFields(ocrText);

    // Step 3: Compute identity confidence score
    const confidenceScore = computeIdentityConfidenceScore(extracted);

    // Step 4: Sanctions screening
    const sanctionsResult = await runSanctionsScreening(extracted);
    const sanctionsRisk = computeSanctionsRisk(sanctionsResult);

    // Step 5: Save snapshot
    const snapshot = await prisma.identitySnapshot.create({
      data: {
        ownerId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        ocrText,
        extractedFields: extracted,
        confidenceScore,
        sanctionsResult,
        sanctionsRisk,
        timestamp: new Date(),
      },
    });

    res.json({
      ownerId,
      snapshot,
    });
  } catch (err) {
    console.error("Identity Upload Error:", err);
    res.status(500).json({ error: "Failed to process identity document" });
  }
});

/**
 * GET /identity/:ownerId
 * Returns latest identity snapshot (fields + confidence + sanctions)
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

    const latest = await prisma.identitySnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.json({
        ownerId,
        confidenceScore: null,
        extractedFields: null,
        sanctionsRisk: null,
        sanctionsResult: null,
        timestamp: null,
      });
    }

    res.json({
      ownerId,
      confidenceScore: latest.confidenceScore,
      extractedFields: latest.extractedFields,
      sanctionsRisk: latest.sanctionsRisk,
      sanctionsResult: latest.sanctionsResult,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("Identity Fetch Error:", err);
    res.status(500).json({ error: "Failed to load identity data" });
  }
});

/**
 * GET /identity/:ownerId/history
 * Returns full identity verification history
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

    const history = await prisma.identitySnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("Identity History Error:", err);
    res.status(500).json({ error: "Failed to load identity history" });
  }
});

module.exports = router;
