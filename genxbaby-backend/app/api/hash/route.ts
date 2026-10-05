// app/api/hash/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid payload. Must be JSON object." },
        { status: 400 }
      );
    }

    // Normalize JSON deterministically
    const normalized = JSON.stringify(body, Object.keys(body).sort());

    // Compute SHA-256 hash
    const hash = crypto
      .createHash("sha256")
      .update(normalized)
      .digest("hex");

    // Return 0x-prefixed hash for smart contract compatibility
    return NextResponse.json({
      hash: `0x${hash}`,
      normalized,
    });
  } catch (err) {
    console.error("Hashing error:", err);
    return NextResponse.json(
      { error: "Failed to compute hash" },
      { status: 500 }
    );
  }
}
