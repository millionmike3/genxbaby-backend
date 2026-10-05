// genxbaby-backend/src/routes/verification.routes.js

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  verifyIdentityFromDocuments,
  verifyDocumentAuthenticity,
  computeCrossDocumentConsistency,
  detectVerificationFraudPatterns,
  computeVerificationScore,
  computeVerificationSeverity,
  computeVerificationTrend,
} = require("../services/verificationService");

/**
 * POST /verification/:ownerId/run
 * Runs full verification pipeline:
 * identity → authenticity → consistency → fraud → score → severity → snapshot
 */
router.post("/:ownerId/run", async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Validate owner
    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Load latest OCR, document, income, bank, and check snapshots
    const [ocr, doc, income, bank, check] = await Promise.all([
      prisma.ocrSnapshot.findFirst({
        where: { ownerId },
        orderBy: { timestamp: "desc" },
      }),
      prisma.documentSnapshot.findFirst({
        where: { ownerId },
        orderBy: { timestamp: "desc" },
      }),
      prisma.incomeSnapshot.findFirst({
        where: { ownerId },
        orderBy: { timestamp: "desc" },
      }),
      prisma.bankSnapshot.findFirst({
        where: { ownerId },
        orderBy: { timestamp: "desc" },
      }),
      prisma.checkSnapshot.findFirst({
        where: { ownerId },
        orderBy: { timestamp: "desc" },
      }),
    ]);

    // Step 1: Identity verification (name, DOB, address, employer)
    const identity = verifyIdentityFromDocuments({
      ocr,
      doc,
      income,
      bank,
      check,
    });

    // Step 2: Document authenticity (tampering, mismatches, formatting anomalies)
    const authenticity = verifyDocumentAuthenticity({
      ocr,
      doc,
      income,
      check,
    });

    // Step 3: Cross-document consistency (name match, employer match, address match)
    const consistency = computeCrossDocumentConsistency({
      ocr,
      doc,
      income,
      bank,
      check,
    });

    // Step 4: Fraud pattern detection (identity mismatch, forged docs, altered checks)
    const fraudPatterns = detectVerificationFraudPatterns({
      identity,
      authenticity,
      consistency,
    });

    // Step 5: Verification score (0–100)
    const score = computeVerificationScore({
      identity,
      authenticity,
      consistency,
      fraudPatterns,
    });

    // Step 6: Severity (LOW, MEDIUM, HIGH, CRITICAL)
    const severity = computeVerificationSeverity(score);

    // Step 7: Trend (improving, stable, worsening)
    const trend = await computeVerificationTrend(ownerId);

    // Step 8: Save snapshot
    const snapshot = await prisma.verificationSnapshot.create({
      data: {
        ownerId,
        identity,
        authenticity,
        consistency,
        fraudPatterns,
        score,
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
    console.error("Verification Run Error:", err);
    res.status(500).json({ error: "Failed to run verification pipeline" });
  }
});

/**
 * GET /verification/:ownerId
 * Returns latest verification snapshot
 */
router.get("/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const latest = await prisma.verificationSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.json({
        ownerId,
        identity: null,
        authenticity: null,
        consistency: null,
        fraudPatterns: null,
        score: null,
        severity: null,
        timestamp: null,
      });
    }

    res.json({
      ownerId,
      identity: latest.identity,
      authenticity: latest.authenticity,
      consistency: latest.consistency,
      fraudPatterns: latest.fraudPatterns,
      score: latest.score,
      severity: latest.severity,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("Verification Fetch Error:", err);
    res.status(500).json({ error: "Failed to load verification data" });
  }
});

/**
 * GET /verification/:ownerId/history
 * Returns full verification history
 */
router.get("/:ownerId/history", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const history = await prisma.verificationSnapshot.findMany({
      where: { ownerId },
      orderBy: { timestamp: "asc" },
    });

    res.json({
      ownerId,
      history,
    });
  } catch (err) {
    console.error("Verification History Error:", err);
    res.status(500).json({ error: "Failed to load verification history" });
  }
});

/**
 * POST /verification/:ownerId/evaluate
 * Re-evaluates latest verification snapshot
 */
router.post("/:ownerId/evaluate", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const latest = await prisma.verificationSnapshot.findFirst({
      where: { ownerId },
      orderBy: { timestamp: "desc" },
    });

    if (!latest) {
      return res.status(400).json({
        error: "No verification snapshots available",
      });
    }

    // Recompute score
    const score = computeVerificationScore({
      identity: latest.identity,
      authenticity: latest.authenticity,
      consistency: latest.consistency,
      fraudPatterns: latest.fraudPatterns,
    });

    // Recompute severity
    const severity = computeVerificationSeverity(score);

    // Trend
    const trend = await computeVerificationTrend(ownerId);

    // Save new snapshot
    const snapshot = await prisma.verificationSnapshot.create({
      data: {
        ownerId,
        identity: latest.identity,
        authenticity: latest.authenticity,
        consistency: latest.consistency,
        fraudPatterns: latest.fraudPatterns,
        score,
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
    console.error("Verification Evaluation Error:", err);
    res.status(500).json({ error: "Failed to evaluate verification snapshot" });
  }
});

module.exports = router;
