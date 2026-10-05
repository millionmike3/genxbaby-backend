// genxbaby-backend/src/routes/documentFraud.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const upload = multer({ dest: "uploads/" });

const {
  analyzeDocumentFraud,
  computeDocumentFraudScore,
} = require("../services/documentFraudService");

/**
 * POST /fraud/documents/scan
 * Upload a document and run fraud analysis
 */
router.post("/documents/scan", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Run fraud analysis
    const fraudAnalysis = await analyzeDocumentFraud(req.file.path);

    // Compute fraud score
    const fraudScore = computeDocumentFraudScore(fraudAnalysis);

    res.json({
      fileName: req.file.originalname,
      fraudScore,
      fraudAnalysis,
    });
  } catch (err) {
    console.error("Document Fraud Scan Error:", err);
    res.status(500).json({ error: "Failed to scan document for fraud" });
  }
});

/**
 * POST /fraud/documents/owners/:ownerId/scan
 * Upload a document for an owner and save fraud analysis
 */
router.post(
  "/documents/owners/:ownerId/scan",
  upload.single("file"),
  async (req, res) => {
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

      // Run fraud analysis
      const fraudAnalysis = await analyzeDocumentFraud(req.file.path);

      // Compute fraud score
      const fraudScore = computeDocumentFraudScore(fraudAnalysis);

      // Save fraud scan record
      const record = await prisma.documentFraudScan.create({
        data: {
          ownerId,
          fileName: req.file.originalname,
          filePath: req.file.path,
          fraudScore,
          fraudAnalysis,
          timestamp: new Date(),
        },
      });

      res.json(record);
    } catch (err) {
      console.error("Owner Document Fraud Error:", err);
      res.status(500).json({ error: "Failed to scan owner document for fraud" });
    }
  }
);

/**
 * GET /fraud/documents/owners/:ownerId/history
 * Returns document fraud scan history for an owner
 */
router.get("/documents/owners/:ownerId/history", async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Ensure owner exists
    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const history = await prisma.documentFraudScan.findMany({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("Document Fraud History Error:", err);
    res.status(500).json({ error: "Failed to load document fraud history" });
  }
});

module.exports = router;
