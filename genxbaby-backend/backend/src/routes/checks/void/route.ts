import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { logAudit } from "@/lib/logAudit";

export async function POST(req: Request) {
  try {
    const cookie = (req as any).cookies.get("admin_session")?.value;
    if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(cookie, process.env.JWT_SECRET!) as any;

    const { checkId } = await req.json();

    const updated = await prisma.check.update({
      where: { id: checkId },
      data: { memo: "VOIDED" },
    });

    await logAudit("VOID_CHECK", { checkId });

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error("VOID CHECK ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
