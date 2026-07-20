import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const cookie = (req as any).cookies.get("admin_session")?.value;
    if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(cookie, process.env.JWT_SECRET!) as any;

    if (payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        admin: {
          select: { email: true, walletAddress: true },
        },
      },
    });

    return NextResponse.json({ logs });
  } catch (err) {
    console.error("AUDIT LIST ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
