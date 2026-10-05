import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { runUnderwriting } from "../underwriting/decisionEngine";

const prisma = new PrismaClient();
const router = Router();

/**
 * POST /underwriting/score
 * Runs risk scoring + fraud detection
 */
router.post("/score", async (req, res) => {
  try {
    const { applicationId } = req.body;

    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        borrower: true,
        documents: true,
      },
    });

    if (!app) {
      return res.status(404).json({ error: "Application not found" });
    }

    const result = runUnderwriting(app, app.borrower);

    const updated = await prisma.underwriting.upsert({
      where: { applicationId },
      update: {
        riskScore: result.score,
        fraudSignals: result.fraudSignals,
        decision: result.decision,
        pricingModel: { rate: result.rate, tier: result.tier },
        decidedAt: new Date(),
      },
      create: {
        applicationId,
        riskScore: result.score,
        fraudSignals: result.fraudSignals,
        decision: result.decision,
        pricingModel: { rate: result.rate, tier: result.tier },
        decidedAt: new Date(),
      },
    });

    res.json({ underwriting: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Underwriting scoring failed" });
  }
});

/**
 * POST /underwriting/decision
 * Saves final decision to Application model
 */
router.post("/decision", async (req, res) => {
  try {
    const { applicationId } = req.body;

    const uw = await prisma.underwriting.findUnique({
      where: { applicationId },
    });

    if (!uw) {
      return res.status(404).json({ error: "Underwriting not found" });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        decisionStatus: uw.decision,
        decisionTier: uw.pricingModel?.tier || null,
        decisionRate: uw.pricingModel?.rate || null,
        decisionNotes: "Auto‑decision generated",
      },
    });

    res.json({ application: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Decision update failed" });
  }
});

export default router;
