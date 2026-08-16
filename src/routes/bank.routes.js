// genxbaby-backend/src/routes/bank.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const upload = multer({ dest: "uploads/" });

const {
  runBankStatementOCR,
  extractBankFields,
  extractTransactions,
  computeBalances,
  detectBankFraudPatterns,
  computeBankRiskScore,
  computeBankSeverity,
  computeBankTrend,
} = require("../services/bankService");

/**
 * POST /bank/:ownerId/upload
 * Upload → OCR → field extraction → transactions → balances → fraud → risk → snapshot
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
    const ocrText = await runBankStatementOCR(req.file.path);

    // Step 2: Extract bank fields (account name, number, routing, balances)
    const fields = extractBankFields(ocrText);

    // Step 3: Extract transactions
    const transactions = extractTransactions(ocrText);

    // Step 4: Compute balances (beginning, ending, running)
    const balances = computeBalances(
      transactions,
      fields.beginningBalance || null
    );

    // Step 5: Fraud patterns
    const fraudPatterns = detectBankFraudPatterns({
      transactions,
      beginningBalance: balances.beginningBalance,
      endingBalance: balances.endingBalance,
    });

    // Step 6: Risk score (0–100)
    const riskScore = computeBankRiskScore({
      transactions,
      fraudPatterns,
      beginningBalance: balances.beginningBalance,
      endingBalance: balances.endingBalance,
    });

    // Step 7: Severity (LOW, MEDIUM, HIGH, CRITICAL)
    const severity = computeBankSeverity(riskScore);

    // Step 8: Save snapshot
    const snapshot = await prisma.bankSnapshot.create({
      data: {
        ownerId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        ocrText,
        fields,
        transactions,
        balances,
        fraudPatterns,
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
    console.error("Bank Upload Error:", err);
    res.status(500).json({ error: "Failed to process bank statement" });
  }
});

/**
 * GET /bank/:ownerId
 * Returns latest bank snapshot
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

    const latest = await prisma.bankSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.json({
        ownerId,
        fields: null,
        transactions: null,
        balances: null,
        fraudPatterns: null,
        riskScore: null,
        severity: null,
        timestamp: null,
      });
    }

    res.json({
      ownerId,
      fields: latest.fields,
      transactions: latest.transactions,
      balances: latest.balances,
      fraudPatterns: latest.fraudPatterns,
      riskScore: latest.riskScore,
      severity: latest.severity,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("Bank Fetch Error:", err);
    res.status(500).json({ error: "Failed to load bank data" });
  }
});

/**
 * GET /bank/:ownerId/history
 * Returns full bank history for an owner
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

    const history = await prisma.bankSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("Bank History Error:", err);
    res.status(500).json({ error: "Failed to load bank history" });
  }
});

/**
 * POST /bank/:ownerId/evaluate
 * Forces a new bank evaluation + snapshot
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

    const latest = await prisma.bankSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.status(400).json({
        error: "No bank statements uploaded yet",
      });
    }

    // Recompute fraud patterns
    const fraudPatterns = detectBankFraudPatterns({
      transactions: latest.transactions,
      beginningBalance: latest.balances.beginningBalance,
      endingBalance: latest.balances.endingBalance,
    });

    // Recompute risk score
    const riskScore = computeBankRiskScore({
      transactions: latest.transactions,
      fraudPatterns,
      beginningBalance: latest.balances.beginningBalance,
      endingBalance: latest.balances.endingBalance,
    });

    // Recompute severity
    const severity = computeBankSeverity(riskScore);

    // Trend (improving, stable, worsening)
    const trend = await computeBankTrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.bankSnapshot.create({
      data: {
        ownerId,
        fileName: latest.fileName,
        filePath: latest.filePath,
        ocrText: latest.ocrText,
        fields: latest.fields,
        transactions: latest.transactions,
        balances: latest.balances,
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
    console.error("Bank Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate bank metrics" });
  }
});

module.exports = router;
