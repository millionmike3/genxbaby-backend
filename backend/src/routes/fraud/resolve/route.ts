import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { logAudit } from "@/lib/logAudit";

export async function POST(req: Request) {
  try {
    const cookie = (req as any).cookies.get("admin_session")?.value;
    if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    jwt.verify(cookie, process.env.JWT_SECRET!);

    const { id } = await req.json();

    const updated = await prisma.fraudFlag.update({
      where: { id },
      data: { resolved: true },
    });

    await logAudit("RESOLVE_FRAUD_FLAG", { flagId: id });

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error("RESOLVE FRAUD ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
