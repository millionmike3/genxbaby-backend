import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { createPublicClient, http } from "viem";
import { polygonAmoy } from "viem/chains";
import { CHECK_REGISTRY_ABI } from "@/lib/contract";

export async function GET(request: Request) {
  try {
    // 1. Extract admin_token cookie manually
    const cookieHeader = request.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("admin_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // 2. Verify JWT using JOSE
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    let payload: any;

    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch (err) {
      console.error("JWT VERIFY ERROR:", err);
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    // 3. Fetch admin from database
    const admin = await prisma.admin.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        role: true,
        walletAddress: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    // 4. On-chain admin verification
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

    // 5. Return admin profile + session info
    return NextResponse.json(
      {
        admin,
        onChainAdmin,
        session: {
          expiresIn: payload.exp,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN ME ERROR:", err);
    return NextResponse.json(
      { error: "Invalid session" },
      { status: 401 }
    );
  }
}
