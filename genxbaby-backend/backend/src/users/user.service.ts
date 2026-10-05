import prisma from '../prisma/prisma';

export const UserService = {
  async getProfile(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: { role: true }
        },
        permissions: {
          include: { permission: true }
        }
      }
    });
  }
};
