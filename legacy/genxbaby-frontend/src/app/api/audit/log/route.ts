import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { actor, action, target, metadata } = body;

  if (!actor || !action) {
    return NextResponse.json({ error: "Missing actor or action" }, { status: 400 });
  }

  await prisma.auditLog.create({
    data: {
      actor,
      action,
      target: target || null,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });

  return NextResponse.json({ success: true });
}
