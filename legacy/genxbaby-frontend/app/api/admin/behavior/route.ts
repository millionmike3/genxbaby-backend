import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const profiles = await prisma.behaviorProfile.findMany({
      include: {
        user: true,
        lead: true,
      },
      orderBy: {
        avgImpulsivenessScore: "desc",
      },
    });

    return NextResponse.json({ profiles });
  } catch (err) {
    console.error("ADMIN BEHAVIOR ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load behavior profiles" },
      { status: 500 }
    );
  }
}
