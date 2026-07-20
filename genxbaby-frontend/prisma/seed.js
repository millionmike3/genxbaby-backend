import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding signers...");

  // Clear existing signers (optional)
  await prisma.signer.deleteMany();

  // Fetch bank profiles so we can attach signers
  const bankA = await prisma.bankProfile.findUnique({
    where: { id: "mt-operating-a" }
  });

  const bankB = await prisma.bankProfile.findUnique({
    where: { id: "mt-operating-b" }
  });

  if (!bankA || !bankB) {
    console.log("Bank profiles not found. Seed bank profiles first.");
    return;
  }

  // Create signers for Bank A
  await prisma.signer.createMany({
    data: [
      {
        name: "Michael Turner",
        title: "President & Chairman",
        signatureImage: "/signatures/michael.png",
        bankProfileId: bankA.id
      },
      {
        name: "John Doe",
        title: "Chief Financial Officer",
        signatureImage: "/signatures/cfo.png",
        bankProfileId: bankA.id
      }
    ]
  });

  // Create signers for Bank B
  await prisma.signer.createMany({
    data: [
      {
        name: "Michael Turner",
        title: "President & Chairman",
        signatureImage: "/signatures/michael.png",
        bankProfileId: bankB.id
      }
    ]
  });

  console.log("Signers seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
