require("dotenv").config(); // Load .env BEFORE Prisma

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = { prisma };
