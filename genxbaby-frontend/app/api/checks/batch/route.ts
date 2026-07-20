import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateBatchChecksPdf } from "@/lib/pdf/batchCheckGenerator";

export async function POST(req: Request) {
  try {
    const { checkIds } = await req.json();

    if (!checkIds || !Array.isArray(checkIds) || checkIds.length === 0) {
      return NextResponse.json(
        { error: "No check IDs provided" },
        { status: 400 }
      );
    }

    // Load checks with correct relations
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

    // Format for PDF generator
    const formattedChecks = checks.map((c) => ({
      bank: c.bankProfile,
      signer: c.signer,
      checkNumber: c.checkNumber,
      payee: c.payee,
      amount: c.amount,
      memo: c.memo,
      date: c.date,
    }));

    // Generate combined PDF
    const pdfBytes = await generateBatchChecksPdf(formattedChecks);

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=batch-checks.pdf",
      },
    });
  } catch (error) {
    console.error("Batch PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate batch PDF" },
      { status: 500 }
    );
  }
}
