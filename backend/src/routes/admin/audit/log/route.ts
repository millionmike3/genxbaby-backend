import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookie = (req as any).cookies.get("admin_session")?.value;
    if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(cookie, process.env.JWT_SECRET!) as any;

    const { action, metadata } = await req.json();

    const ip =
      (req.headers as any).get?.("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    await prisma.auditLog.create({
      data: {
        adminId: payload.adminId,
        action,
        metadata,
        ip,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("AUDIT LOG ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
