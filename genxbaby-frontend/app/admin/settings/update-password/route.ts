import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logAudit } from "@/lib/logAudit";

export async function POST(req: Request) {
  try {
    const cookie = (req as any).cookies.get("admin_session")?.value;
    if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(cookie, process.env.JWT_SECRET!) as any;
    const { password } = await req.json();

    const hash = await bcrypt.hash(password, 10);

    await prisma.admin.update({
      where: { id: payload.id },
      data: { passwordHash: hash },
    });

    await logAudit("ADMIN_PASSWORD_CHANGE", { adminId: payload.id });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PASSWORD UPDATE ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
