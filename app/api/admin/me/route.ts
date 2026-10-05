import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { createPublicClient, http } from "viem";
import { polygonAmoy } from "viem/chains";
import { CHECK_REGISTRY_ABI } from "@/lib/contract";

export async function GET(req: Request) {
  try {
    const cookie = (req as any).cookies.get("admin_session")?.value;

    if (!cookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = jwt.verify(cookie, process.env.JWT_SECRET!) as any;

    const admin = await prisma.admin.findUnique({
      where: { id: payload.adminId },
      select: {
        id: true,
        email: true,
        role: true,
        walletAddress: true,
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // ---------------------------------------------
    // On-chain admin verification
    // ---------------------------------------------
    let onChainAdmin = false;

    if (admin.walletAddress) {
      const client = createPublicClient({
        chain: polygonAmoy,
        transport: http(process.env.NEXT_PUBLIC_RPC_URL!),
      });

      onChainAdmin = await client.readContract({
        address: process.env.CHECK_REGISTRY_ADDRESS as `0x${string}`,
        abi: CHECK_REGISTRY_ABI,
        functionName: "isAdmin",
        args: [admin.walletAddress],
      });
    }

    return NextResponse.json({
      admin,
      onChainAdmin,
      session: {
        expiresIn: payload.exp,
      },
    });
  } catch (err) {
    console.error("ADMIN ME ERROR:", err);
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}
