import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createPublicClient, http } from "viem";
import { polygonAmoy } from "viem/chains";
import CheckRegistryAbi from "@/abi/CheckRegistry.json";
import { checkRegistryAddress } from "@/config/blockchain";
import { buildMerkleRoot } from "@/lib/merkle";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // 1. Get all audit logs (or last 500)
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "asc" },
      take: 500,
    });

    if (!logs.length) {
      return NextResponse.json({
        success: false,
        reason: "No logs found",
      });
    }

    // 2. Extract hashes
    const hashes = logs.map((l) => l.hash);

    // 3. Recompute Merkle root
    const recomputedRoot = buildMerkleRoot(hashes);

    // 4. Read on-chain root
    const client = createPublicClient({
      chain: polygonAmoy,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL),
    });

    const onChainRoot = await client.readContract({
      address: checkRegistryAddress,
      abi: CheckRegistryAbi,
      functionName: "latestAuditRoot",
    });

    // 5. Compare
    const match = onChainRoot.toLowerCase() === recomputedRoot?.toLowerCase();

    return NextResponse.json({
      success: true,
      match,
      recomputedRoot,
      onChainRoot,
      count: logs.length,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, reason: "Verification failed" },
      { status: 500 }
    );
  }
}
