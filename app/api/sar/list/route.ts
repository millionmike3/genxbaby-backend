import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const cookie = (req as any).cookies.get("admin_session")?.value;
    if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    jwt.verify(cookie, process.env.JWT_SECRET!);

    const sar = await prisma.suspiciousActivityReport.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        flag: true,
        check: true,
      },
    });

    return NextResponse.json({ sar });
  } catch (err) {
    console.error("SAR LIST ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
