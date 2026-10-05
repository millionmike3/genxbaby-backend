import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const { id } = params;

  const borrower = await prisma.lead.findUnique({
    where: { id },
  });

  const behavior = await prisma.behaviorProfile.findFirst({
    where: { leadId: id },
  });

  const checks = await prisma.check.findMany({
    where: { payee: borrower.email },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ borrower, behavior, checks });
}
