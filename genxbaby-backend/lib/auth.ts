import { jwtVerify } from "jose";

export async function verifyAdminToken(request: Request) {
  // Extract cookie header
  const cookieHeader = request.headers.get("cookie") || "";

  // Find admin_token
  const token = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("admin_token="))
    ?.split("=")[1];

  if (!token) {
    throw new Error("Unauthorized: Missing admin_token");
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (!payload || payload.role !== "admin") {
      throw new Error("Unauthorized: Invalid role");
    }

    return payload; // { id, role }
  } catch (err) {
    console.error("JWT VERIFY ERROR:", err);
    throw new Error("Unauthorized: Invalid or expired token");
  }
}
