// lib/auth.ts
import jwt from "jsonwebtoken";

export type UserSession = {
  address: string;
  roles: string[];
};

export function getUserFromCookie(cookieHeader?: string): UserSession | null {
  if (!cookieHeader) return null;

  const token = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("session="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserSession;
    return decoded;
  } catch (err) {
    console.error("JWT error:", err);
    return null;
  }
}

export function requireAdmin(session: UserSession | null): boolean {
  if (!session) return false;
  return session.roles.includes("admin");
}
