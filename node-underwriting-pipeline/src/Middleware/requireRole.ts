import { verifyToken } from "@/lib/auth/jwt";

export const requireRole = (allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const decoded = verifyToken(token);

    if (!decoded || !allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.admin = decoded;
    next();
  };
};
