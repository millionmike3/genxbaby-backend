import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const cookie = (req as any).cookies.get("admin_session")?.value;

    if (!cookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = jwt.verify(cookie, process.env.JWT_SECRET!) as any;

    const admin = await prisma.admin.findUnique({
      where: { id: payload.adminId },
      select: {
        id: true,
        email: true,
        role: true,
        walletAddress: true,
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({
      admin,
      session: {
        expiresIn: payload.exp,
      },
    });
  } catch (err) {
    console.error("ADMIN ME ERROR:", err);
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}
