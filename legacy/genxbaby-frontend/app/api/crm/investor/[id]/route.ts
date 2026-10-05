import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const { id } = params;

  const investor = await prisma.investor.findUnique({
    where: { id },
  });

  const behavior = await prisma.behaviorProfile.findFirst({
    where: { investorId: id },
  });

  const investments = await prisma.investment.findMany({
    where: { investorId: id },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ investor, behavior, investments });
}
