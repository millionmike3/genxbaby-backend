import { Worker, Queue } from "./connection";
import { PrismaClient } from "@prisma/client";
import { connection } from "./connection";
import { generateMerkleRoot } from "../services/merkle.service";

const prisma = new PrismaClient();

// Notification queue
export const notificationQueue = new Queue("notifications", { connection });

/**
 * Anchoring Worker (Mortgage Underwriting System)
 *
 * This worker:
 *  - receives a leaf (caseId:riskScore)
 *  - generates a Merkle root for the single case
 *  - simulates anchoring on-chain (txHash + blockNumber)
 *  - updates the underwriting case
 *  - sends a notification
 */
export const anchoringWorker = new Worker(
  "anchoring",
  async job => {
    const { caseId, leaf } = job.data as {
      caseId: number;
      leaf: string;
    };

    // Step 1 — Generate Merkle root for this single case
    const merkleRoot = generateMerkleRoot([leaf]);

    // Step 2 — Simulate Polygon anchoring
    const txHash = `0x${merkleRoot.slice(2, 66)}`;
    const blockNumber = Math.floor(Math.random() * 1_000_000);
    const anchoredAt = new Date();

    // Step 3 — Update underwriting case
    await prisma.underwritingCase.update({
      where: { id: caseId },
      data: {
        merkleRoot,
        anchoredTxHash: txHash,
        anchoredBlock: blockNumber,
        anchoredAt
      }
    });

    // Step 4 — Send notification
    await notificationQueue.add("anchored", {
      type: "ANCHOR_COMPLETE",
      message: `Case ${caseId} anchored on-chain`,
      caseId,
      merkleRoot,
      txHash,
      blockNumber,
      anchoredAt
    });

    return { caseId, txHash, merkleRoot };
  },
  { connection }
);
