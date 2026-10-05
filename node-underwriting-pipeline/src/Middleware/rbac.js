const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function requirePermission(permissionKey) {
  return async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

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

    const userPerms = user.roles.flatMap((ur) =>
      ur.role.permissions.map((rp) => rp.permission.key)
    );

    if (!userPerms.includes(permissionKey)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
}

module.exports = { requirePermission };
