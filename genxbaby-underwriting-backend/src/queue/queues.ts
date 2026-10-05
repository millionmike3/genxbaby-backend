import { Queue } from "bullmq";
import { connection } from "../workers/connection";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listUnderwritingCases() {
  return prisma.underwritingCase.findMany({
    // Add filters or includes if needed, otherwise leave empty
  });
}

/**
 * Underwriting Queue
 * Runs risk scoring for mortgage underwriting cases.
 */
export const underwritingQueue = new Queue("underwriting", {
  connection
});

/**
 * Anchoring Queue
 * Anchors underwriting cases on-chain (simulated).
 */
export const anchoringQueue = new Queue("anchoring", {
  connection
});

/**
 * Notification Queue
 * Stores notifications triggered by underwriting + anchoring.
 */
export const notificationQueue = new Queue("notifications", {
  connection
});
