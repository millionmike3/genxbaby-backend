import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyMessage, createPublicClient, http } from "viem";
import { polygonAmoy } from "viem/chains";
import { CHECK_REGISTRY_ABI } from "@/lib/contract";

export async function GET(req: Request) {
  try {
    const cookie = (req as any).cookies.get("admin_session")?.value;

    if (!cookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = jwt.verify(cookie, process.env.JWT_SECRET!) as any;

    const wallet = payload.wallet;
    if (!wallet) {
      return NextResponse.json(
        { error: "Admin has no wallet assigned" },
        { status: 400 }
      );
    }

    const client = createPublicClient({
      chain: polygonAmoy,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL!),
    });

    const isAdminOnChain = await client.readContract({
      address: process.env.CHECK_REGISTRY_ADDRESS as `0x${string}`,
      abi: CHECK_REGISTRY_ABI,
      functionName: "isAdmin",
      args: [wallet],
    });

    return NextResponse.json({ onchain: isAdminOnChain });
  } catch (err) {
    console.error("ONCHAIN ADMIN CHECK ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
