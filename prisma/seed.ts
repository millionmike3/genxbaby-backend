import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BankProfile records…");

  // Optional: clear existing records
  await prisma.bankProfile.deleteMany();

  await prisma.bankProfile.createMany({
    data: [
      {
        id: "mt-operating-a",
        bankName: "M&T – Operating A",
        routingNumber: "022000046",
        accountNumber: "9897201688",
        accountType: "Operating",
        signerName: "Michael Turner",
        signatureImage: "/signatures/michael.png",
        nextCheckNumber: 100000001
      },
      {
        id: "mt-operating-b",
        bankName: "M&T – Operating B",
        routingNumber: "022000046",
        accountNumber: "15004251667895",
        accountType: "Operating",
        signerName: "Michael Turner",
        signatureImage: "/signatures/michael.png",
        nextCheckNumber: 200000001
      }
    ]
  });

  console.log("✔ Bank profiles seeded successfully");
}

main()
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
