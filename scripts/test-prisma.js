// 1. Load .env BEFORE ANYTHING ELSE and override all existing env vars
require("dotenv").config({ override: true });

// 2. Remove any dotenvx-injected DATABASE_URL
delete process.env.DATABASE_URL;

// 3. Reload .env again to restore the correct value
require("dotenv").config({ override: true });

const { prisma } = require("../lib/prisma");

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users:", users);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
