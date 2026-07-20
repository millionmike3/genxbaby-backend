import { NextResponse } from "next/server";
import { generateCheckPdf } from "@/lib/generateCheckPdf";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const pdfBytes = await generateCheckPdf({
      bank: body.bank,
      signer: body.signer,
      checkNumber: body.checkNumber,
      payee: body.payee,
      amount: body.amount,
      memo: body.memo,
      date: body.date,
    });

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=check-${body.checkNumber}.pdf`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
