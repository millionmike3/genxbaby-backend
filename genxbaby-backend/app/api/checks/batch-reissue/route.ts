import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { checkIds } = await req.json();

    if (!checkIds || !Array.isArray(checkIds) || checkIds.length === 0) {
      return NextResponse.json(
        { error: "No check IDs provided" },
        { status: 400 }
      );
    }

    // Load original checks
    const checks = await prisma.check.findMany({
      where: { id: { in: checkIds } },
      include: {
        bankProfile: true,
        signer: true,
      },
    });

    if (checks.length === 0) {
      return NextResponse.json(
        { error: "No matching checks found" },
        { status: 404 }
      );
    }

    const newChecks = [];

    for (const oldCheck of checks) {
      // Get next check number
      const nextNumber = oldCheck.bankProfile.nextCheckNumber;

      // Create new check record
      const newCheck = await prisma.check.create({
        data: {
          checkNumber: nextNumber,
          payee: oldCheck.payee,
          amount: oldCheck.amount,
          memo: oldCheck.memo,
          date: new Date(), // new issue date
          bankProfileId: oldCheck.bankProfileId,
          signerId: oldCheck.signerId,
          status: "valid",
          reissuedFromId: oldCheck.id,
        },
      });

      newChecks.push(newCheck);

      // Update bank next check number
      await prisma.bankProfile.update({
        where: { id: oldCheck.bankProfileId },
        data: { nextCheckNumber: nextNumber + 1 },
      });

      // Mark old check as reissued
      await prisma.check.update({
        where: { id: oldCheck.id },
        data: { status: "reissued" },
      });
    }

    return NextResponse.json({
      success: true,
      count: newChecks.length,
      newChecks,
    });
  } catch (error) {
    console.error("Batch reissue error:", error);
    return NextResponse.json(
      { error: "Failed to reissue checks" },
      { status: 500 }
    );
  }
}
