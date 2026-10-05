"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.underwritingWorker = void 0;
const bullmq_1 = require("bullmq");
const queues_1 = require("../queue/queues");
const client_1 = require("@prisma/client");
const engine_1 = require("../services/underwriting/engine");
const connection_1 = require("./connection"); // ✅ clean import
const prisma = new client_1.PrismaClient();
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
exports.underwritingWorker = new bullmq_1.Worker("underwriting", async (job) => {
    const { caseId } = job.data;
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
    const result = await (0, engine_1.runMortgageUnderwriting)({
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
    await queues_1.anchoringQueue.add("anchor", {
        caseId,
        leaf: `${caseId}:${result.riskScore}`
    });
    // Queue notification
    await queues_1.notificationQueue.add("decision", {
        caseId,
        decision: result.decision,
        riskScore: result.riskScore
    });
    return result;
}, { connection: connection_1.connection } // ✅ simplified
);
