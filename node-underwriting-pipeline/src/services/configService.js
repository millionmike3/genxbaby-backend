const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getConfig(ownerId) {
  return prisma.ownerConfig.findUnique({
    where: { ownerId },
  });
}

async function updateConfig(ownerId, data) {
  return prisma.ownerConfig.upsert({
    where: { ownerId },
    update: data,
    create: { ownerId, ...data },
  });
}

module.exports = { getConfig, updateConfig };
