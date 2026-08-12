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

    // CSV Header
    const header = [
      "CheckNumber",
      "Payee",
      "Amount",
      "Date",
      "Memo",
      "Status",
      "BankName",
      "RoutingNumber",
      "AccountNumber",
      "SignerName",
      "SignerTitle",
      "CreatedAt"
    ].join(",");

    // CSV Rows
    const rows = checks.map((c) =>
      [
        c.checkNumber,
        `"${c.payee}"`,
        c.amount,
        `"${c.date}"`,
        `"${c.memo || ""}"`,
        c.status,
        `"${c.bankProfile.bankName}"`,
        c.bankProfile.routingNumber,
        c.bankProfile.accountNumber,
        `"${c.signer?.name || ""}"`,
        `"${c.signer?.title || ""}"`,
        c.createdAt.toISOString()
      ].join(",")
    );

    const csv = [header, ...rows].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="checks_export.csv"`
      }
    });
  } catch (error) {
    console.error("Batch CSV export error:", error);
    return NextResponse.json(
      { error: "Failed to export CSV" },
      { status: 500 }
    );
  }
}
