import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const profiles = await prisma.bankProfile.findMany({
    orderBy: { bankName: "asc" }
  });

  return NextResponse.json(profiles);
}
