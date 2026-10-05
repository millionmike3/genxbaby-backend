import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createWalletClient, http } from "viem";
import { polygonAmoy } from "viem/chains";
import CheckRegistryAbi from "@/abi/CheckRegistry.json";
import { checkRegistryAddress } from "@/config/blockchain";
import { buildMerkleRoot } from "@/lib/merkle";
import { privateKeyToAccount } from "viem/accounts";

const prisma = new PrismaClient();

const adminAccount = privateKeyToAccount(
  `0x${process.env.ADMIN_PRIVATE_KEY!}`
);

const walletClient = createWalletClient({
  account: adminAccount,
  chain: polygonAmoy,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

export async function POST() {
  try {
    // 1. Get recent audit logs
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "asc" },
      take: 500, // batch size
    });

    if (!logs.length) {
      return NextResponse.json({ error: "No logs to anchor" }, { status: 400 });
    }

    // 2. Extract hashes
    const hashes = logs.map((l) => l.hash);

    // 3. Build Merkle root
    const root = buildMerkleRoot(hashes);
    if (!root) {
      return NextResponse.json({ error: "Failed to build root" }, { status: 500 });
    }

    // 4. Anchor on-chain
    const txHash = await walletClient.writeContract({
      address: checkRegistryAddress,
      abi: CheckRegistryAbi,
      functionName: "anchorAuditRoot",
      args: [root as `0x${string}`],
    });

    // 5. Store anchor record
    await prisma.auditAnchor.create({
      data: {
        root,
        count: logs.length,
      },
    });

    return NextResponse.json({ success: true, root, txHash });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Anchor failed" }, { status: 500 });
  }
}
