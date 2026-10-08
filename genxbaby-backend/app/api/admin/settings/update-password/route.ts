import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    // 1. Read admin cookie
    const cookieHeader = request.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("admin_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Verify JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    let payload: any;

    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch (err) {
      console.error("JWT VERIFY ERROR:", err);
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    // 3. Parse request body
    const { passwordHash, adminId } = await request.json();

    if (!passwordHash || !adminId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 4. Ensure the adminId matches the JWT payload
    if (payload.id !== adminId) {
      return NextResponse.json(
        { error: "Unauthorized: ID mismatch" },
        { status: 403 }
      );
    }

    // 5. Update password in DB
    await prisma.admin.update({
      where: { id: adminId },
      data: { passwordHash },
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (err) {
    console.error("BACKEND PASSWORD UPDATE ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
