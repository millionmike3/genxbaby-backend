import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }) {
  const profile = await prisma.bankProfile.findUnique({
    where: { id: params.bankProfileId },
    select: {
      bankName: true,
      routingNumber: true,
      accountNumber: true,
      accountType: true
    }
  });

  return NextResponse.json(profile);
}
