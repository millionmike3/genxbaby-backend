// genxbaby-backend/src/routes/ocr.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const upload = multer({ dest: "uploads/" });

const {
  runGenericOCR,
  cleanOCRText,
  detectDocumentTypeFromOCR,
  extractFieldsFromOCR,
} = require("../services/ocrService");

/**
 * POST /ocr/:ownerId/run
 * Uploads a file → runs OCR → cleans text → extracts fields → saves snapshot
 */
router.post("/:ownerId/run", upload.single("file"), async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Validate owner
    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Step 1: Run OCR
    const rawText = await runGenericOCR(req.file.path);

    // Step 2: Clean OCR text (remove noise, normalize spacing)
    const cleanedText = cleanOCRText(rawText);

    // Step 3: Detect document type from OCR content
    const docType = detectDocumentTypeFromOCR(cleanedText);

    // Step 4: Extract structured fields based on docType
    const fields = extractFieldsFromOCR(docType, cleanedText);

    // Step 5: Save OCR snapshot
    const snapshot = await prisma.ocrSnapshot.create({
      data: {
        ownerId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        rawText,
        cleanedText,
        docType,
        fields,
        timestamp: new Date(),
      },
    });

    res.json({
      ownerId,
      snapshot,
    });
  } catch (err) {
    console.error("OCR Run Error:", err);
    res.status(500).json({ error: "Failed to run OCR" });
  }
});

/**
 * GET /ocr/:ownerId
 * Returns latest OCR snapshot
 */
router.get("/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const latest = await prisma.ocrSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.json({
        ownerId,
        rawText: null,
        cleanedText: null,
        docType: null,
        fields: null,
        timestamp: null,
      });
    }

    res.json({
      ownerId,
      rawText: latest.rawText,
      cleanedText: latest.cleanedText,
      docType: latest.docType,
      fields: latest.fields,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("OCR Fetch Error:", err);
    res.status(500).json({ error: "Failed to load OCR data" });
  }
});

/**
 * GET /ocr/:ownerId/history
 * Returns full OCR history for an owner
 */
router.get("/:ownerId/history", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const history = await prisma.ocrSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("OCR History Error:", err);
    res.status(500).json({ error: "Failed to load OCR history" });
  }
});

/**
 * POST /ocr/:ownerId/evaluate
 * Re-evaluates the latest OCR snapshot (re-extract fields, re-detect docType)
 */
router.post("/:ownerId/evaluate", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const latest = await prisma.ocrSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.status(400).json({
        error: "No OCR snapshots available",
      });
    }

    // Re-detect docType
    const docType = detectDocumentTypeFromOCR(latest.cleanedText);

    // Re-extract fields
    const fields = extractFieldsFromOCR(docType, latest.cleanedText);

    // Save new snapshot
    const snapshot = await prisma.ocrSnapshot.create({
      data: {
        ownerId,
        fileName: latest.fileName,
        filePath: latest.filePath,
        rawText: latest.rawText,
        cleanedText: latest.cleanedText,
        docType,
        fields,
        timestamp: new Date(),
      },
    });

    res.json({
      ownerId,
      snapshot,
    });
  } catch (err) {
    console.error("OCR Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate OCR snapshot" });
  }
});

module.exports = router;
