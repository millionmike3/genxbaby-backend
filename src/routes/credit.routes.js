// genxbaby-backend/src/routes/credit.routes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ocrService = require("../services/ocrService");
const creditService = require("../services/creditReportService");
const dtiService = require("../services/dtiService");

/**
 * POST /credit/:ownerId/upload
 * Upload → OCR → SSN → tradelines → monthly debt → total debt → fraud → risk → severity → trend → credit + DTI snapshots
 */
router.post("/:ownerId/upload", upload.single("file"), async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Ensure owner exists
    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // 1. OCR
    const ocrText = await ocrService.runGenericOCR(req.file.path);
    const cleanedText = ocrService.cleanOCRText(ocrText);

    // 2. Extract SSN
    const ssn = creditService.extractSSN(cleanedText);

    // 3. Extract tradelines
    const tradelines = creditService.extractTradelines(cleanedText);

    // 4. Compute monthly + total debt
    const monthlyDebt = creditService.computeMonthlyDebt(tradelines);
    const totalDebt = creditService.computeTotalDebt(tradelines);

    // 5. Fraud patterns
    const fraudPatterns = creditService.detectCreditFraudPatterns({
      ssn,
      tradelines,
    });

    // 6. Credit risk score
    const riskScore = creditService.computeCreditRiskScore({
      tradelines,
      fraudPatterns,
    });

    // 7. Severity
    const severity = creditService.computeCreditSeverity(riskScore);

    // 8. Trend
    const trend = await creditService.computeCreditTrend(ownerId);

    // 9. Save credit snapshot
    const creditSnapshot = await prisma.creditSnapshot.create({
      data: {
        ownerId,
        fileName: req.file.originalname,
        filePath: req.file.path,
        ocrText,
        ssn,
        tradelines,
        monthlyDebt,
        totalDebt,
        fraudPatterns,
        riskScore,
        severity,
        trend,
        timestamp: new Date(),
      },
    });

    // 10. Pull latest income snapshot for DTI
    const incomeSnap = await prisma.incomeSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    const grossMonthlyIncome =
      incomeSnap?.extractedFields?.grossMonthly ||
      incomeSnap?.extractedFields?.netMonthly ||
      0;

    // 11. Compute DTI
    const dti = dtiService.computeDTI({
      monthlyDebt,
      grossMonthlyIncome,
    });

    const dtiFraud = dtiService.detectDTIFraudPatterns({
      dti,
      monthlyDebt,
      grossMonthlyIncome,
    });

    const dtiSeverity = dtiService.computeDTISeverity(dti);
    const dtiTrend = await dtiService.computeDTITrend(ownerId);

    // 12. Save DTI snapshot
    const dtiSnapshot = await prisma.dtiSnapshot.create({
      data: {
        ownerId,
        dti,
        monthlyDebt,
        grossMonthlyIncome,
        fraudPatterns: dtiFraud,
        severity: dtiSeverity,
        trend: dtiTrend,
        timestamp: new Date(),
      },
    });

    res.json({
      ownerId,
      credit: creditSnapshot,
      dti: dtiSnapshot,
    });
  } catch (err) {
    console.error("Credit Upload Error:", err);
    res.status(500).json({ error: "Failed to process credit report" });
  }
});

/**
 * GET /credit/:ownerId
 * Returns latest credit snapshot
 */
router.get("/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const latest = await prisma.creditSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.json({
        ownerId,
        ssn: null,
        tradelines: null,
        monthlyDebt: null,
        totalDebt: null,
        fraudPatterns: null,
        riskScore: null,
        severity: null,
        trend: null,
        timestamp: null,
      });
    }

    res.json({
      ownerId,
      ssn: latest.ssn,
      tradelines: latest.tradelines,
      monthlyDebt: latest.monthlyDebt,
      totalDebt: latest.totalDebt,
      fraudPatterns: latest.fraudPatterns,
      riskScore: latest.riskScore,
      severity: latest.severity,
      trend: latest.trend,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("Credit Fetch Error:", err);
    res.status(500).json({ error: "Failed to load credit data" });
  }
});

/**
 * GET /credit/:ownerId/history
 * Returns full credit history
 */
router.get("/:ownerId/history", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const history = await prisma.creditSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({ ownerId, history });
  } catch (err) {
    console.error("Credit History Error:", err);
    res.status(500).json({ error: "Failed to load credit history" });
  }
});

/**
 * GET /dti/:ownerId
 * Returns latest DTI snapshot
 */
router.get("/dti/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const latest = await prisma.dtiSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.json({
        ownerId,
        dti: null,
        monthlyDebt: null,
        grossMonthlyIncome: null,
        fraudPatterns: null,
        severity: null,
        trend: null,
        timestamp: null,
      });
    }

    res.json({
      ownerId,
      dti: latest.dti,
      monthlyDebt: latest.monthlyDebt,
      grossMonthlyIncome: latest.grossMonthlyIncome,
      fraudPatterns: latest.fraudPatterns,
      severity: latest.severity,
      trend: latest.trend,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("DTI Fetch Error:", err);
    res.status(500).json({ error: "Failed to load DTI data" });
  }
});

module.exports = router;
