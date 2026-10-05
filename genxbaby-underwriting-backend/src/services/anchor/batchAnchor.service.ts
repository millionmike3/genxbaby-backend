import { PrismaClient } from "@prisma/client";
import { generateMerkleRoot } from "../merkle.service";
import { logAudit } from "../audit/log";

const prisma = new PrismaClient();

export async function batchAnchorCases(caseIds: number[]) {
  if (!Array.isArray(caseIds) || caseIds.length === 0) {
    throw new Error("caseIds must be a non-empty array");
  }

  const anchorRecords: any[] = [];

  // Step 1 — Load underwriting cases
  const cases = await prisma.underwritingCase.findMany({
    where: { id: { in: caseIds } }
  });

  if (cases.length === 0) {
    throw new Error("No underwriting cases found for provided IDs");
  }

  // Step 2 — Build leaves + individual Merkle roots
  for (const c of cases) {
    const leaf = `${c.id}:${c.riskScore}`;
    const merkleRoot = generateMerkleRoot([leaf]);

    anchorRecords.push({
      caseId: c.id,
      applicationId: c.id.toString(), // ✅ map caseId to applicationId
      leaf,
      merkleRoot,
      riskScore: c.riskScore
    });
  }

  // Step 3 — Batch Merkle root
  const batchMerkleRoot = generateMerkleRoot(
    anchorRecords.map(r => r.merkleRoot)
  );

  // Step 4 — Simulate Polygon anchoring
  const txHash = `0x${batchMerkleRoot.slice(2, 66)}`;
  const blockNumber = Math.floor(Math.random() * 1_000_000);
  const anchoredAt = new Date();

  // Step 5 — Create batch record
  const batch = await prisma.anchorBatch.create({
    data: {
      merkleRoot: batchMerkleRoot,
      txHash,
      blockNumber,
      anchoredAt
    }
  });

  // Step 6 — Create individual anchor records + update cases
  for (const record of anchorRecords) {
    await prisma.anchorRecord.create({
      data: {
        applicationId: record.applicationId, // ✅ schema field
        merkleRoot: record.merkleRoot,
        txHash,
        blockNumber,
        anchoredAt,
        batchId: batch.id,
        riskScore: record.riskScore
      }
    });

    await prisma.underwritingCase.update({
      where: { id: record.caseId },
      data: {
        merkleRoot: record.merkleRoot,
        anchoredTxHash: txHash,
        anchoredBlock: blockNumber,
        anchoredAt
      }
    });
  }

  // Step 7 — Audit log
  await logAudit({
    actor: "admin",
    action: "BATCH_ANCHOR",
    target: batch.id,
    metadata: {
      caseIds,
      batchMerkleRoot,
      txHash,
      blockNumber
    }
  });

  return {
    batch,
    anchorRecords,
    txHash,
    blockNumber,
    anchoredAt
  };
}
