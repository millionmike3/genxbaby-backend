import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const profile = await prisma.behaviorProfile.findUnique({
      where: { id },
      include: { user: true, lead: true },
    });

    const sessions = await prisma.behaviorSession.findMany({
      where: {
        OR: [
          { userId: profile?.userId },
          { leadId: profile?.leadId },
        ],
      },
      orderBy: { startedAt: "desc" },
    });

    return NextResponse.json({ profile, sessions });
  } catch (err) {
    console.error("BEHAVIOR DETAIL ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load behavior detail" },
      { status: 500 }
    );
  }
}
