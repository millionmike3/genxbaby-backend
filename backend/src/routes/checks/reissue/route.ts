import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { logAudit } from "@/lib/logAudit";

export async function POST(req: Request) {
  try {
    const cookie = (req as any).cookies.get("admin_session")?.value;
    if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(cookie, process.env.JWT_SECRET!) as any;

    const { oldCheckId, newCheckNumber } = await req.json();

    const oldCheck = await prisma.check.update({
      where: { id: oldCheckId },
      data: { memo: "REISSUED" },
    });

    const newCheck = await prisma.check.create({
      data: {
        checkNumber: newCheckNumber,
        payee: oldCheck.payee,
        amount: oldCheck.amount,
        memo: "REISSUE",
        date: new Date(),
        bankProfileId: oldCheck.bankProfileId,
        signerId: oldCheck.signerId,
        reissuedToId: oldCheck.id,
      },
    });

    await logAudit("REISSUE_CHECK", {
      oldCheckId,
      newCheckId: newCheck.id,
      newCheckNumber,
    });

    return NextResponse.json({ success: true, newCheck });
  } catch (err) {
    console.error("REISSUE CHECK ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
