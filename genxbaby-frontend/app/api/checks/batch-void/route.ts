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

    // Update all selected checks to VOIDED
    const result = await prisma.check.updateMany({
      where: { id: { in: checkIds } },
      data: { status: "voided" },
    });

    return NextResponse.json({
      success: true,
      voidedCount: result.count,
      message: `${result.count} checks voided successfully`,
    });
  } catch (error) {
    console.error("Batch VOID error:", error);
    return NextResponse.json(
      { error: "Failed to void checks" },
      { status: 500 }
    );
  }
}
