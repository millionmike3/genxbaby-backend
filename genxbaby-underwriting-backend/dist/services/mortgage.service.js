"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mortgageService = exports.underwritingCaseQueue = void 0;
exports.createMortgage = createMortgage;
exports.getMortgageWithCase = getMortgageWithCase;
const client_1 = require("@prisma/client");
const bullmq_1 = require("bullmq");
const connection_1 = require("../workers/connection");
const prisma = new client_1.PrismaClient();
// Underwriting queue (worker processes risk scoring)
exports.underwritingCaseQueue = new bullmq_1.Queue("underwriting", { connection: connection_1.connection });
/**
 * Create a mortgage + underwriting case
 * This is the correct flow for Option A (Mortgage Underwriting System)
 */
async function createMortgage(data) {
    // Create mortgage record
    const mortgage = await prisma.mortgage.create({ data });
    // Create underwriting case linked to mortgage + borrower
    const uwCase = await prisma.underwritingCase.create({
        data: {
            borrowerId: mortgage.borrowerId,
            mortgageId: mortgage.id
        }
    });
    // Queue underwriting job
    await exports.underwritingCaseQueue.add("run", { caseId: uwCase.id });
    return { mortgage, uwCase };
}
/**
 * Get mortgage with borrower + property + underwriting case
 */
async function getMortgageWithCase(mortgageId) {
    return prisma.mortgage.findUnique({
        where: { id: mortgageId },
        include: {
            borrower: true,
            property: true,
            underwritingCase: true
        }
    });
}
/**
 * Simple service wrapper (kept for compatibility)
 */
exports.mortgageService = {
    async create(data) {
        return createMortgage(data);
    }
};
