require("dotenv").config({ override: true });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding multi-tenant RBAC + banking system...");

  // 1. Clear in dependency order
  await prisma.suspiciousActivityReport.deleteMany();
  await prisma.fraudFlag.deleteMany();
  await prisma.check.deleteMany();
  await prisma.signer.deleteMany();
  await prisma.bankProfile.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();
  await prisma.owner.deleteMany();
  await prisma.admin.deleteMany();

  // 2. Owner
  const owner = await prisma.owner.create({
    data: {
      name: "Resilient America Inc.",
      email: "owner@resilientamerica.org",
    },
  });

  // 3. Permissions
  const permissionKeys = [
    { key: "bank.read", name: "Read bank profiles" },
    { key: "bank.write", name: "Manage bank profiles" },
    { key: "check.issue", name: "Issue checks" },
    { key: "check.void", name: "Void checks" },
    { key: "check.reissue", name: "Reissue checks" },
    { key: "signer.manage", name: "Manage signers" },
    { key: "user.manage", name: "Manage users" },
  ];

  await prisma.permission.createMany({ data: permissionKeys });
  const allPerms = await prisma.permission.findMany();

  // 4. Roles
  const ownerRole = await prisma.role.create({
    data: { ownerId: owner.id, name: "OWNER" },
  });

  const adminRole = await prisma.role.create({
    data: { ownerId: owner.id, name: "ADMIN" },
  });

  const issuerRole = await prisma.role.create({
    data: { ownerId: owner.id, name: "CHECK_ISSUER" },
  });

  // 5. RolePermissions
  await prisma.rolePermission.createMany({
    data: [
      // OWNER gets everything
      ...allPerms.map((p) => ({
        roleId: ownerRole.id,
        permissionId: p.id,
      })),

      // ADMIN gets everything except owner.super
      ...allPerms.map((p) => ({
        roleId: adminRole.id,
        permissionId: p.id,
      })),

      // CHECK_ISSUER limited
      ...allPerms
        .filter((p) =>
          ["check.issue", "check.void", "check.reissue", "bank.read"].includes(p.key)
        )
        .map((p) => ({
          roleId: issuerRole.id,
          permissionId: p.id,
        })),
    ],
  });

  // 6. Users
  const ownerUser = await prisma.user.create({
    data: {
      ownerId: owner.id,
      email: "michael.turner@resilientamerica.org",
      name: "Michael Turner",
      password: "hashed-password-here",
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      ownerId: owner.id,
      email: "cfo@resilientamerica.org",
      name: "Chief Financial Officer",
      password: "hashed-password-here",
    },
  });

  const issuerUser = await prisma.user.create({
    data: {
      ownerId: owner.id,
      email: "issuer@resilientamerica.org",
      name: "Check Issuer",
      password: "hashed-password-here",
    },
  });

  // 7. UserRoles
  await prisma.userRole.createMany({
    data: [
      { userId: ownerUser.id, roleId: ownerRole.id },
      { userId: adminUser.id, roleId: adminRole.id },
      { userId: issuerUser.id, roleId: issuerRole.id },
    ],
  });

  // 8. BankProfiles
  const bankA = await prisma.bankProfile.create({
    data: {
      ownerId: owner.id,
      bankName: "M&T – Operating A",
      routingNumber: "022000046",
      accountNumber: "9897201688",
      accountType: "Operating",
      signerName: "Michael Turner",
      signatureImage: "/signatures/michael.png",
      nextCheckNumber: 100000001,
    },
  });

  const bankB = await prisma.bankProfile.create({
    data: {
      ownerId: owner.id,
      bankName: "M&T – Operating B",
      routingNumber: "022000046",
      accountNumber: "15004251667895",
      accountType: "Operating",
      signerName: "Michael Turner",
      signatureImage: "/signatures/michael.png",
      nextCheckNumber: 200000001,
    },
  });

  // 9. Signers
  const signerMichaelA = await prisma.signer.create({
    data: {
      bankProfileId: bankA.id,
      name: "Michael Turner",
      title: "President & Chairman",
      signatureImage: "/signatures/michael.png",
    },
  });

  const signerCFOA = await prisma.signer.create({
    data: {
      bankProfileId: bankA.id,
      name: "John Doe",
      title: "Chief Financial Officer",
      signatureImage: "/signatures/cfo.png",
    },
  });

  const signerMichaelB = await prisma.signer.create({
    data: {
      bankProfileId: bankB.id,
      name: "Michael Turner",
      title: "President & Chairman",
      signatureImage: "/signatures/michael.png",
    },
  });

  // 10. Checks
  await prisma.check.createMany({
    data: [
      {
        bankProfileId: bankA.id,
        signerId: signerMichaelA.id,
        checkNumber: 100000001,
        payee: "Vendor A",
        amount: 1500.0,
        memo: "Operating expenses",
        date: new Date(),
      },
      {
        bankProfileId: bankA.id,
        signerId: signerCFOA.id,
        checkNumber: 100000002,
        payee: "Vendor B",
        amount: 2500.0,
        memo: "Consulting",
        date: new Date(),
      },
      {
        bankProfileId: bankB.id,
        signerId: signerMichaelB.id,
        checkNumber: 200000001,
        payee: "Vendor C",
        amount: 5000.0,
        memo: "Capital expenditure",
        date: new Date(),
      },
    ],
  });

  console.log("✔ Multi-tenant seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
