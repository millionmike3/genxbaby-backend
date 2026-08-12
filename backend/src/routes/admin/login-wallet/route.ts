import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { verifyMessage, createPublicClient, http } from "viem";
import { polygonAmoy } from "viem/chains";
import { CHECK_REGISTRY_ABI } from "@/lib/contract";

export async function POST(req: Request) {
  try {
    const { address, signature, message } = await req.json();

    if (!address || !signature || !message) {
      return NextResponse.json(
        { error: "Missing wallet login data" },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // 1. Verify signature
    // ---------------------------------------------
    const ok = await verifyMessage({
      address,
      message,
      signature,
      chain: polygonAmoy,
    });

    if (!ok) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // ---------------------------------------------
    // 2. On-chain role verification
    // ---------------------------------------------
    const client = createPublicClient({
      chain: polygonAmoy,
      transport: http(process.env.NEXT_PUBLIC_RPC_URL!),
    });

    const isAdminOnChain = await client.readContract({
      address: process.env.CHECK_REGISTRY_ADDRESS as `0x${string}`,
      abi: CHECK_REGISTRY_ABI,
      functionName: "isAdmin",
      args: [address],
    });

    if (!isAdminOnChain) {
      return NextResponse.json(
        { error: "On-chain role check failed" },
        { status: 403 }
      );
    }

    // ---------------------------------------------
    // 3. Database admin lookup
    // ---------------------------------------------
    const admin = await prisma.admin.findUnique({
      where: { walletAddress: address.toLowerCase() },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Wallet not authorized as admin" },
        { status: 403 }
      );
    }

    // ---------------------------------------------
    // 4. Issue JWT session cookie
    // ---------------------------------------------
    const token = jwt.sign(
      {
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
        wallet: admin.walletAddress,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    );

    const res = NextResponse.json({ success: true });

    res.cookies.set({
      name: "admin_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    });

    return res;
  } catch (err) {
    console.error("ADMIN WALLET LOGIN ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
