require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env")
});




const { prisma } = require("../lib/prisma.js");
const bcrypt = require("bcryptjs");

async function main() {
  const email = "admin@genxbaby.com";
  const plain = "SuperSecurePassword123";

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(plain, salt);

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash: hash },
    create: { email, passwordHash: hash },
  });

  console.log("Admin seeded:", email);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
