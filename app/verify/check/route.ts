import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const checkNumber = Number(searchParams.get("checkNumber"));

    const check = await prisma.check.findUnique({
      where: { checkNumber },
      include: {
        bankProfile: true,
        signer: true,
        fraudFlags: true,
        sarReports: true,
      },
    });

    if (!check) {
      return NextResponse.json({
        valid: false,
        reason: "Check not found",
      });
    }

    // Check validity
    const valid = check.memo !== "VOIDED" && check.memo !== "REISSUED";

    // Latest blockchain anchor
    const anchor = await prisma.auditAnchor.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      valid,
      reason: valid ? "Check is valid" : "Check is voided or reissued",
      check,
      bank: check.bankProfile,
      signer: check.signer,
      fraudFlags: check.fraudFlags,
      sar: check.sarReports,
      root: anchor?.root || null,
      anchored: !!anchor,
    });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
