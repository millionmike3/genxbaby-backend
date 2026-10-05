import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const checks = await prisma.check.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      bankProfile: true
    }
  });

  return NextResponse.json(checks);
}
