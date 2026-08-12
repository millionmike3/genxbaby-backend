import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createWalletClient, http } from "viem";
import { polygonAmoy } from "viem/chains";
import { CHECK_REGISTRY_ABI } from "@/lib/contract";

export async function POST(req: Request) {
  try {
    const cookie = (req as any).cookies.get("admin_session")?.value;
    if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(cookie, process.env.JWT_SECRET!) as any;

    if (payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { wallet } = await req.json();

    const client = createWalletClient({
      chain: polygonAmoy,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL!),
      account: process.env.ADMIN_PRIVATE_KEY as `0x${string}`,
    });

    const tx = await client.writeContract({
      address: process.env.CHECK_REGISTRY_ADDRESS as `0x${string}`,
      abi: CHECK_REGISTRY_ABI,
      functionName: "revokeRole",
      args: ["DEFAULT_ADMIN_ROLE", wallet],
    });

    return NextResponse.json({ success: true, tx });
  } catch (err) {
    console.error("REVOKE ROLE ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
