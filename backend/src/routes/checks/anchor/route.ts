import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createWalletClient, http } from "viem";
import { polygonAmoy } from "viem/chains";
import { CHECK_REGISTRY_ABI } from "@/lib/contract";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { logAudit } from "@/lib/logAudit";

function sha256(data: string) {
  return "0x" + crypto.createHash("sha256").update(data).digest("hex");
}

export async function POST(req: Request) {
  try {
    const cookie = (req as any).cookies.get("admin_session")?.value;
    if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    jwt.verify(cookie, process.env.JWT_SECRET!);

    const checks = await prisma.check.findMany({
      orderBy: { createdAt: "desc" },
    });

    const leaves = checks.map((c) =>
      sha256(JSON.stringify({ id: c.id, checkNumber: c.checkNumber }))
    );

    let level = [...leaves];
    while (level.length > 1) {
      const next = [];
      for (let i = 0; i < level.length; i += 2) {
        const left = level[i];
        const right = level[i + 1] ?? left;
        next.push(sha256(left + right.replace("0x", "")));
      }
      level = next;
    }

    const root = level[0];

    const client = createWalletClient({
      chain: polygonAmoy,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL!),
      account: process.env.ADMIN_PRIVATE_KEY as `0x${string}`,
    });

    const tx = await client.writeContract({
      address: process.env.CHECK_REGISTRY_ADDRESS as `0x${string}`,
      abi: CHECK_REGISTRY_ABI,
      functionName: "anchorAuditRoot",
      args: [root],
    });

    await prisma.auditAnchor.create({
      data: {
        root,
        count: checks.length,
      },
    });

    await logAudit("ANCHOR_MERKLE_ROOT", { root, count: checks.length });

    return NextResponse.json({ success: true, root, tx });
  } catch (err) {
    console.error("ANCHOR ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
