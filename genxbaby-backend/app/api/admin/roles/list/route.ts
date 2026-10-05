import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const cookie = (req as any).cookies.get("admin_session")?.value;
    if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(cookie, process.env.JWT_SECRET!) as any;

    // Only admins can view roles
    if (payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        walletAddress: true,
      },
    });

    return NextResponse.json({ admins });
  } catch (err) {
    console.error("ROLE LIST ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
