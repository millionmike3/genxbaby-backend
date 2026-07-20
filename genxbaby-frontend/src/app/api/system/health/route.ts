import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createPublicClient, http } from "viem";
import { polygonAmoy } from "viem/chains";
import CheckRegistryAbi from "@/abi/CheckRegistry.json";
import { checkRegistryAddress } from "@/config/blockchain";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // DB check
    const auditCount = await prisma.auditLog.count();

    // Latest anchor
    const latestAnchor = await prisma.auditAnchor.findFirst({
      orderBy: { createdAt: "desc" },
    });

    // RPC + contract check
    const client = createPublicClient({
      chain: polygonAmoy,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL),
    });

    let contractOK = true;
    try {
      await client.readContract({
        address: checkRegistryAddress,
        abi: CheckRegistryAbi,
        functionName: "latestAuditRoot",
      });
    } catch {
      contractOK = false;
    }

    return NextResponse.json({
      db: true,
      auditCount,
      latestRoot: latestAnchor?.root || null,
      lastAnchor: latestAnchor?.createdAt || null,
      contract: contractOK,
      rpc: true,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        db: false,
        auditCount: 0,
        latestRoot: null,
        lastAnchor: null,
        contract: false,
        rpc: false,
      },
      { status: 500 }
    );
  }
}
