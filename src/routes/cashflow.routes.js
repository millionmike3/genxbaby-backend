// genxbaby-backend/src/routes/cashflow.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ocrService = require("../services/ocrService");
const cashflowService = require("../services/cashflowService");
const bankService = require("../services/bankService");
const creditService = require("../services/creditReportService");

/**
 * POST /cashflow/:ownerId/upload
 * Uploads CSV or statement → OCR → transactions → monthly cashflow → recurring → fraud → risk → volatility → snapshot
 */
router.post("/:ownerId/upload", upload.single("file"), async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Validate owner
    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // 1. OCR (works for PDFs, images, statements)
    const ocrText = await ocrService.runGenericOCR(req.file.path);
    const cleanedText = ocrService.cleanOCRText(ocrText);

    // 2. Extract transactions (reuse bankService)
    const transactions = bankService.extractTransactions(cleanedText);

    // 3. Monthly cashflow
    const monthlyCashflow = cashflowService.computeMonthlyCashflow(transactions);

    // 4. Recurring payments
    const recurringPayments = cashflowService.detectRecurringPayments(transactions);

    // 5. Fraud patterns
    const fraudPatterns = cashflowService.detectCashflowFraudPatterns({
      monthlyCashflow,
      recurringPayments,
    });

    // 6. Risk score
    const riskScore = cashflowService.computeCashflowRiskScore({
      monthlyCashflow,
      recurringPayments,
      fraudPatterns,
    });

    // 7. Severity
    const severity = cashflowService.computeCashflowSeverity(riskScore);

    // 8. Trend
    const trend = await cashflowService.computeCashflowTrend(ownerId);

    // 9. Save snapshot
    const snapshot = await prisma.cashflowSnapshot.create({
      data: {
        ownerId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        monthlyCashflow,
        recurringPayments,
        fraudPatterns,
        riskScore,
        severity,
        trend,
        timestamp: new Date(),
      },
    });

    res.json({ ownerId, snapshot });
  } catch (err) {
    console.error("Cashflow Upload Error:", err);
    res.status(500).json({ error: "Failed to process cashflow document" });
  }
});

/**
 * GET /cashflow/:ownerId
 * Returns latest cashflow snapshot
 */
router.get("/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const latest = await prisma.cashflowSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.json({
        ownerId,
        monthlyCashflow: null,
        recurringPayments: null,
        fraudPatterns: null,
        riskScore: null,
        severity: null,
        trend: null,
        timestamp: null,
      });
    }

    res.json({
      ownerId,
      monthlyCashflow: latest.monthlyCashflow,
      recurringPayments: latest.recurringPayments,
      fraudPatterns: latest.fraudPatterns,
      riskScore: latest.riskScore,
      severity: latest.severity,
      trend: latest.trend,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("Cashflow Fetch Error:", err);
    res.status(500).json({ error: "Failed to load cashflow data" });
  }
});

/**
 * GET /cashflow/:ownerId/history
 * Returns full cashflow history
 */
router.get("/:ownerId/history", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const history = await prisma.cashflowSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({ ownerId, history });
  } catch (err) {
    console.error("Cashflow History Error:", err);
    res.status(500).json({ error: "Failed to load cashflow history" });
  }
});

/**
 * POST /cashflow/:ownerId/evaluate
 * Recomputes cashflow using latest bank + ACH + checks + credit → saves new snapshot
 */
router.post("/:ownerId/evaluate", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    // Pull latest bank snapshot
    const bankSnap = await prisma.bankSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    const bankTx = bankSnap?.transactions || [];

    // Pull ACH snapshot
    const achSnap = await prisma.achSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });
    const achTx = achSnap?.transactions || [];

    // Pull checks snapshot
    const checkSnap = await prisma.checkSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });
    const checkTx = checkSnap?.transactions || [];

    // Merge all transactions
    const allTransactions = [...bankTx, ...achTx, ...checkTx];

    // Monthly cashflow
    const monthlyCashflow = cashflowService.computeMonthlyCashflow(allTransactions);

    // Recurring payments
    const recurringPayments = cashflowService.detectRecurringPayments(allTransactions);

    // Fraud patterns
    const fraudPatterns = cashflowService.detectCashflowFraudPatterns({
      monthlyCashflow,
      recurringPayments,
    });

    // Risk score
    const riskScore = cashflowService.computeCashflowRiskScore({
      monthlyCashflow,
      recurringPayments,
      fraudPatterns,
    });

    // Severity
    const severity = cashflowService.computeCashflowSeverity(riskScore);

    // Trend
    const trend = await cashflowService.computeCashflowTrend(ownerId);

    // Save snapshot
    const snapshot = await prisma.cashflowSnapshot.create({
      data: {
        ownerId,
        monthlyCashflow,
        recurringPayments,
        fraudPatterns,
        riskScore,
        severity,
        trend,
        timestamp: new Date(),
      },
    });

    res.json({ ownerId, snapshot });
  } catch (err) {
    console.error("Cashflow Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate cashflow metrics" });
  }
});

module.exports = router;
