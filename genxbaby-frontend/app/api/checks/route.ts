import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { profileId, payee, amount, memo, date } = await req.json();

  // 1. Atomically increment nextCheckNumber
  const updated = await prisma.bankProfile.update({
    where: { id: profileId },
    data: { nextCheckNumber: { increment: 1 } }
  });

  const checkNumber = updated.nextCheckNumber - 1;

  // 2. Log the check in the Check table
  const checkRecord = await prisma.check.create({
    data: {
      checkNumber,
      payee,
      amount,
      memo,
      date,
      bankProfileId: profileId
    }
  });

  return NextResponse.json({
    success: true,
    checkNumber,
    checkRecord
  });
}
