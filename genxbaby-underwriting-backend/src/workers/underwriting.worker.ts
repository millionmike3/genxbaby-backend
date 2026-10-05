import { Worker } from "bullmq"; 
import { underwritingQueue, anchoringQueue, notificationQueue } from "../queue/queues";
import { PrismaClient } from "@prisma/client";
import { runMortgageUnderwriting } from "../services/underwriting/engine";
import { connection } from "./connection"; // ✅ clean import

const prisma = new PrismaClient();
/**
 * Underwriting Worker (Mortgage Underwriting — Option A)
 *
 * This worker:
 *  - loads the underwriting case
 *  - loads borrower + mortgage + property
 *  - runs the mortgage underwriting engine
 *  - saves risk scores + decision
 *  - enqueues anchoring + notifications
 */
export const underwritingWorker = new Worker(
  "underwriting",
  async job => {
    const { caseId } = job.data as { caseId: number };

    // Load underwriting case with borrower + mortgage + property
    const ucase = await prisma.underwritingCase.findUnique({
      where: { id: caseId },
      include: {
        borrower: true,
        mortgage: {
          include: {
            property: true
          }
        }
      }
    });

    if (!ucase) {
      throw new Error(`Underwriting case ${caseId} not found`);
    }
    // Run mortgage underwriting engine
    const result = await runMortgageUnderwriting({
      borrower: ucase.borrower,
      mortgage: ucase.mortgage,
      property: ucase.mortgage.property
    });

    // Save underwriting results
    await prisma.underwritingCase.update({
      where: { id: caseId },
      data: {
        riskScore: result.riskScore,
        collateralScore: result.collateralScore,
        fraudScore: result.fraudScore,
        financialScore: result.financialScore,
        behaviorScore: result.behaviorScore,
        decision: result.decision,
        pricingJson: JSON.stringify(result.pricing), // ✅ schema field
        decidedAt: new Date()
      }
    });
    // Queue anchoring
    await anchoringQueue.add("anchor", {
      caseId,
      leaf: `${caseId}:${result.riskScore}`
    });

    // Queue notification
    await notificationQueue.add("decision", {
      caseId,
      decision: result.decision,
      riskScore: result.riskScore
    });

    return result;
  },
  { connection } // ✅ simplified
);
