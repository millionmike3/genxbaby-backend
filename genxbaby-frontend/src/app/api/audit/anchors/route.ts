import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const anchors = await prisma.auditAnchor.findMany({
      orderBy: { createdAt: "desc" },
      take: 20, // recent anchors
    });

    return NextResponse.json({ anchors });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load anchors" },
      { status: 500 }
    );
  }
}
