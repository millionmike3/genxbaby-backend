import { PrismaClient } from "@prisma/client";
import { generateMerkleRoot } from "../merkle.service";

const prisma = new PrismaClient();

/**
 * Anchor a single underwriting case on-chain (simulated)
 *
 * This service:
 *  - generates a Merkle root for the case
 *  - simulates a Polygon txHash + blockNumber
 *  - updates the underwriting case
 *  - returns anchor metadata
 */
export async function anchorCase(caseId: number, leaf: string) {
  // Step 1 — Generate Merkle root for this single case
  const merkleRoot = generateMerkleRoot([leaf]);

  // Step 2 — Simulate Polygon anchoring
  const txHash = `0x${merkleRoot.slice(2, 66)}`;
  const blockNumber = Math.floor(Math.random() * 1_000_000);
  const anchoredAt = new Date();

  // Step 3 — Update underwriting case
  const updated = await prisma.underwritingCase.update({
    where: { id: caseId },
    data: {
      merkleRoot,
      anchoredTxHash: txHash,
      anchoredBlock: blockNumber,
      anchoredAt
    }
  });

  return {
    caseId,
    merkleRoot,
    txHash,
    blockNumber,
    anchoredAt,
    updated
  };
}
