import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { checkId } = await req.json();

    const check = await prisma.check.findUnique({
      where: { id: checkId },
    });

    if (!check) {
      return NextResponse.json({ valid: false, reason: "Not found" });
    }

    // Placeholder blockchain logic
    const onChainHash = check.hash; // Replace with actual chain lookup

    const recomputedHash = check.hash; // Replace with real hash recomputation

    const valid = onChainHash === recomputedHash;

    return NextResponse.json({
      valid,
      onChainHash,
      recomputedHash,
      status: check.status,
    });
  } catch (err) {
    console.error("Blockchain verify error:", err);
    return NextResponse.json(
      { error: "Blockchain verification failed" },
      { status: 500 }
    );
  }
}
