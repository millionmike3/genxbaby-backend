import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";

export function requirePermissionRoute(
  permissionKey: string,
  handler: (req: NextRequest, ctx: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx: any) => {
    const userId = req.headers.get("x-user-id"); // or from JWT
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: { include: { permission: true } },
              },
            },
          },
        },
      },
    });

    const userPerms = user?.roles.flatMap((ur) =>
      ur.role.permissions.map((rp) => rp.permission.key)
    ) ?? [];

    if (!userPerms.includes(permissionKey)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return handler(req, ctx);
  };
}
