import { PrismaClient } from "@prisma/client";
import { Queue } from "bullmq";
import { connection } from "../workers/connection";

const prisma = new PrismaClient();

// Underwriting queue (worker processes risk scoring)
export const underwritingCaseQueue = new Queue("underwriting", { connection });

/**
 * Create a mortgage + underwriting case
 * This is the correct flow for Option A (Mortgage Underwriting System)
 */
export async function createMortgage(data: any) {
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
  await underwritingCaseQueue.add("run", { caseId: uwCase.id });

  return { mortgage, uwCase };
}

/**
 * Get mortgage with borrower + property + underwriting case
 */
export async function getMortgageWithCase(mortgageId: number) {
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
export const mortgageService = {
  async create(data: any) {
    return createMortgage(data);
  }
};
