// genxbaby-backend/src/routes/documents.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const upload = multer({ dest: "uploads/" });

const {
  classifyDocumentType,
  runDocumentOCR,
  extractDocumentFields,
  computeDocumentRiskScore,
  computeDocumentSeverity,
  computeDocumentTrend,
} = require("../services/documentsService");

/**
 * POST /documents/:ownerId/upload
 * Uploads ANY document → classification → OCR → field extraction → risk → snapshot
 */
router.post("/:ownerId/upload", upload.single("file"), async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Step 1: Document classification (paystub, ID, bank statement, check, misc)
    const docType = classifyDocumentType(req.file.originalname);

    // Step 2: OCR
    const ocrText = await runDocumentOCR(req.file.path);

    // Step 3: Extract fields (depends on docType)
    const fields = extractDocumentFields(docType, ocrText);

    // Step 4: Risk score (0–100)
    const riskScore = computeDocumentRiskScore({
      docType,
      fields,
      ocrText,
    });

    // Step 5: Severity (LOW, MEDIUM, HIGH, CRITICAL)
    const severity = computeDocumentSeverity(riskScore);

    // Step 6: Save snapshot
    const snapshot = await prisma.documentSnapshot.create({
      data: {
        ownerId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        docType,
        ocrText,
        fields,
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
    console.error("Document Upload Error:", err);
    res.status(500).json({ error: "Failed to process document" });
  }
});

/**
 * GET /documents/:ownerId
 * Returns latest document snapshot
 */
router.get("/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const latest = await prisma.documentSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.json({
        ownerId,
        docType: null,
        fields: null,
        riskScore: null,
        severity: null,
        timestamp: null,
      });
    }

    res.json({
      ownerId,
      docType: latest.docType,
      fields: latest.fields,
      riskScore: latest.riskScore,
      severity: latest.severity,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("Document Fetch Error:", err);
    res.status(500).json({ error: "Failed to load document data" });
  }
});

/**
 * GET /documents/:ownerId/history
 * Returns full document history
 */
router.get("/:ownerId/history", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const history = await prisma.documentSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("Document History Error:", err);
    res.status(500).json({ error: "Failed to load document history" });
  }
});

/**
 * POST /documents/:ownerId/evaluate
 * Forces a new document evaluation + snapshot
 */
router.post("/:ownerId/evaluate", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const latest = await prisma.documentSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.status(400).json({
        error: "No documents uploaded yet",
      });
    }

    // Recompute risk score
    const riskScore = computeDocumentRiskScore({
      docType: latest.docType,
      fields: latest.fields,
      ocrText: latest.ocrText,
    });

    // Recompute severity
    const severity = computeDocumentSeverity(riskScore);

    // Trend
    const trend = await computeDocumentTrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.documentSnapshot.create({
      data: {
        ownerId,
        fileName: latest.fileName,
        filePath: latest.filePath,
        docType: latest.docType,
        ocrText: latest.ocrText,
        fields: latest.fields,
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
    console.error("Document Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate document metrics" });
  }
});

module.exports = router;
