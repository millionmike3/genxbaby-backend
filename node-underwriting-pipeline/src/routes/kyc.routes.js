// genxbaby-backend/src/routes/kyc.routes.js

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

const {
  computeKYCMatchScore,
  computeKYCConsistencyScore,
  computeKYCOverallScore,
  computeKYCTrend,
} = require("../services/kycService");

/**
 * POST /kyc/:ownerId/upload
 * Uploads KYC documents → OCR → extraction → identity match → sanctions → consistency → overall score → snapshot
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

    // Step 2: Extract identity fields
    const extracted = extractIdentityFields(ocrText);

    // Step 3: Identity confidence score
    const confidenceScore = computeIdentityConfidenceScore(extracted);

    // Step 4: Sanctions screening
    const sanctionsResult = await runSanctionsScreening(extracted);
    const sanctionsRisk = computeSanctionsRisk(sanctionsResult);

    // Step 5: KYC match score (name, DOB, address vs owner profile)
    const matchScore = computeKYCMatchScore(owner, extracted);

    // Step 6: Document consistency score (internal consistency across fields)
    const consistencyScore = computeKYCConsistencyScore(extracted);

    // Step 7: Overall KYC score (0–100)
    const overallScore = computeKYCOverallScore({
      confidenceScore,
      sanctionsRisk,
      matchScore,
      consistencyScore,
    });

    // Step 8: Save snapshot
    const snapshot = await prisma.kycSnapshot.create({
      data: {
        ownerId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        ocrText,
        extractedFields: extracted,
        confidenceScore,
        sanctionsResult,
        sanctionsRisk,
        matchScore,
        consistencyScore,
        overallScore,
        timestamp: new Date(),
      },
    });

    res.json({
      ownerId,
      snapshot,
    });
  } catch (err) {
    console.error("KYC Upload Error:", err);
    res.status(500).json({ error: "Failed to process KYC document" });
  }
});

/**
 * GET /kyc/:ownerId
 * Returns latest KYC snapshot (identity + sanctions + match + consistency + overall)
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

    const latest = await prisma.kycSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.json({
        ownerId,
        confidenceScore: null,
        sanctionsRisk: null,
        matchScore: null,
        consistencyScore: null,
        overallScore: null,
        timestamp: null,
      });
    }

    res.json({
      ownerId,
      confidenceScore: latest.confidenceScore,
      sanctionsRisk: latest.sanctionsRisk,
      matchScore: latest.matchScore,
      consistencyScore: latest.consistencyScore,
      overallScore: latest.overallScore,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("KYC Fetch Error:", err);
    res.status(500).json({ error: "Failed to load KYC data" });
  }
});

/**
 * GET /kyc/:ownerId/history
 * Returns full KYC history for an owner
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

    const history = await prisma.kycSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("KYC History Error:", err);
    res.status(500).json({ error: "Failed to load KYC history" });
  }
});

/**
 * POST /kyc/:ownerId/evaluate
 * Forces a new KYC evaluation + snapshot
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

    const latest = await prisma.kycSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.status(400).json({
        error: "No KYC documents uploaded yet",
      });
    }

    // Recompute match score
    const matchScore = computeKYCMatchScore(owner, latest.extractedFields);

    // Recompute consistency score
    const consistencyScore = computeKYCConsistencyScore(
      latest.extractedFields
    );

    // Recompute overall score
    const overallScore = computeKYCOverallScore({
      confidenceScore: latest.confidenceScore,
      sanctionsRisk: latest.sanctionsRisk,
      matchScore,
      consistencyScore,
    });

    // Trend (improving, stable, worsening)
    const trend = await computeKYCTrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.kycSnapshot.create({
      data: {
        ownerId,
        fileName: latest.fileName,
        filePath: latest.filePath,
        ocrText: latest.ocrText,
        extractedFields: latest.extractedFields,
        confidenceScore: latest.confidenceScore,
        sanctionsResult: latest.sanctionsResult,
        sanctionsRisk: latest.sanctionsRisk,
        matchScore,
        consistencyScore,
        overallScore,
        trend,
        timestamp: new Date(),
      },
    });

    res.json({
      ownerId,
      snapshot,
    });
  } catch (err) {
    console.error("KYC Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate KYC metrics" });
  }
});

module.exports = router;
