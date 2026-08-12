import prisma from '../prisma/prisma';

export const RoleService = {
  async createRole(name) {
    return prisma.role.create({ data: { name } });
  },

  async assignRole(userId, roleId) {
    return prisma.userRole.create({
      data: { userId, roleId }
    });
  },

  async getRoles() {
    return prisma.role.findMany();
  }
};
