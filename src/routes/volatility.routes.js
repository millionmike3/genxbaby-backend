// genxbaby-backend/src/routes/statements.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const upload = multer({ dest: "uploads/" });

const {
  runStatementOCR,
  extractStatementTransactions,
  computeMonthlySummaries,
  computeStatementRiskScore,
  computeStatementSeverity,
  computeStatementTrend,
} = require("../services/statementsService");

/**
 * POST /statements/:ownerId/upload
 * Uploads a bank statement → OCR → transaction extraction → monthly summaries → risk scoring → snapshot
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
    const ocrText = await runStatementOCR(req.file.path);

    // Step 2: Extract transactions
    const transactions = extractStatementTransactions(ocrText);

    // Step 3: Monthly summaries (inflow/outflow totals, averages, volatility)
    const summaries = computeMonthlySummaries(transactions);

    // Step 4: Risk score (0–100)
    const riskScore = computeStatementRiskScore({
      transactions,
      summaries,
    });

    // Step 5: Severity (LOW, MEDIUM, HIGH, CRITICAL)
    const severity = computeStatementSeverity(riskScore);

    // Step 6: Save snapshot
    const snapshot = await prisma.statementSnapshot.create({
      data: {
        ownerId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        ocrText,
        transactions,
        summaries,
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
    console.error("Statement Upload Error:", err);
    res.status(500).json({ error: "Failed to process bank statement" });
  }
});

/**
 * GET /statements/:ownerId
 * Returns latest statement snapshot (transactions + summaries + risk + severity)
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

    const latest = await prisma.statementSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.json({
        ownerId,
        transactions: null,
        summaries: null,
        riskScore: null,
        severity: null,
        timestamp: null,
      });
    }

    res.json({
      ownerId,
      transactions: latest.transactions,
      summaries: latest.summaries,
      riskScore: latest.riskScore,
      severity: latest.severity,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("Statement Fetch Error:", err);
    res.status(500).json({ error: "Failed to load statement data" });
  }
});

/**
 * GET /statements/:ownerId/history
 * Returns full statement history for an owner
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

    const history = await prisma.statementSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("Statement History Error:", err);
    res.status(500).json({ error: "Failed to load statement history" });
  }
});

/**
 * POST /statements/:ownerId/evaluate
 * Forces a new statement evaluation + snapshot
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

    const latest = await prisma.statementSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.status(400).json({
        error: "No statements uploaded yet",
      });
    }

    // Recompute summaries
    const summaries = computeMonthlySummaries(latest.transactions);

    // Recompute risk score
    const riskScore = computeStatementRiskScore({
      transactions: latest.transactions,
      summaries,
    });

    // Recompute severity
    const severity = computeStatementSeverity(riskScore);

    // Trend (improving, stable, worsening)
    const trend = await computeStatementTrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.statementSnapshot.create({
      data: {
        ownerId,
        fileName: latest.fileName,
        filePath: latest.filePath,
        ocrText: latest.ocrText,
        transactions: latest.transactions,
        summaries,
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
    console.error("Statement Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate statement metrics" });
  }
});

module.exports = router;
