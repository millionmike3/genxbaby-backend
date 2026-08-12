import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const checks = await prisma.check.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ checks });
  } catch (err) {
    console.error("Failed to load checks:", err);
    return NextResponse.json(
      { error: "Failed to load checks" },
      { status: 500 }
    );
  }
}
