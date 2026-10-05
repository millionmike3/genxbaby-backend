import prisma from '../prisma/prisma';

export const PermissionService = {
  async createPermission(key, description) {
    return prisma.permission.create({
      data: { key, description }
    });
  },

  async assignPermission(roleId, permissionId) {
    return prisma.rolePermission.create({
      data: { roleId, permissionId }
    });
  },

  async getPermissions() {
    return prisma.permission.findMany();
  }
};
