console.log("LOADING CHECK CREATE ROUTE");

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { runFraudChecks } from "@/lib/fraud/checkFraud";

export async function POST(req: Request) {
  console.log("POST /api/checks/create HIT");

  try {
    const body = await req.json();
    console.log("RAW BODY:", body);

    const {
      checkNumber,
      payee,
      amount,
      memo,
      date,
      bankProfileId,
      signerId
    } = body;

    // ⭐ VALIDATE REQUIRED FIELDS
    if (!checkNumber || !payee || !amount || !date || !bankProfileId || !signerId) {
      console.error("Missing required fields:", body);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ⭐ ENSURE DATE IS A REAL DATE OBJECT
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date received:", date);
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // ⭐ CREATE CHECK RECORD (initial save)
    const checkRecord = await prisma.check.create({
      data: {
        checkNumber,
        payee,
        amount,
        memo,
        date: parsedDate,
        bankProfileId,
        signerId
      }
    });

    console.log("CHECK RECORD CREATED:", checkRecord.id);

    // ⭐ RUN FRAUD CHECKS
    const fraudFlags = await runFraudChecks(checkRecord);
    console.log("FRAUD FLAGS:", fraudFlags);

    // ⭐ SAVE FRAUD FLAGS TO DATABASE
    if (fraudFlags.length > 0) {
      await prisma.fraudFlag.createMany({
        data: fraudFlags.map((flag) => ({
          checkId: checkRecord.id,
          type: flag.type,
          severity: flag.severity,
          message: flag.message
        }))
      });
    }

    // ⭐ AUTO-INCREMENT NEXT CHECK NUMBER
    await prisma.bankProfile.update({
      where: { id: bankProfileId },
      data: {
        nextCheckNumber: checkNumber + 1
      }
    });

    console.log("NEXT CHECK NUMBER UPDATED");

    return NextResponse.json({
      success: true,
      checkNumber,
      checkRecord,
      fraudFlags
    });

  } catch (error: any) {
    console.error("Create check error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
