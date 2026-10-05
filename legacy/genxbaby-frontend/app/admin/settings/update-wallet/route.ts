import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { logAudit } from "@/lib/logAudit";

export async function POST(req: Request) {
  try {
    const cookie = (req as any).cookies.get("admin_session")?.value;
    if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(cookie, process.env.JWT_SECRET!) as any;
    const { wallet } = await req.json();

    await prisma.admin.update({
      where: { id: payload.id },
      data: { walletAddress: wallet },
    });

    await logAudit("ADMIN_WALLET_UPDATE", { adminId: payload.id, wallet });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("WALLET UPDATE ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
