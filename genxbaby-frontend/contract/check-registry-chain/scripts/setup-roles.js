const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const registerAdmin = process.env.REGISTER_ADMIN;
  const voidAdmin = process.env.VOID_ADMIN;

  if (!contractAddress) throw new Error("Missing CONTRACT_ADDRESS");
  if (!registerAdmin) throw new Error("Missing REGISTER_ADMIN");
  if (!voidAdmin) throw new Error("Missing VOID_ADMIN");

  const registry = await hre.ethers.getContractAt("CheckRegistry", contractAddress);

  console.log("🔐 Granting roles...");

  const tx1 = await registry.addRegisterAdmin(registerAdmin);
  await tx1.wait();
  console.log("✅ REGISTER_ROLE granted to:", registerAdmin);

  const tx2 = await registry.addVoidAdmin(voidAdmin);
  await tx2.wait();
  console.log("✅ VOID_ROLE granted to:", voidAdmin);

  console.log("🎉 Role setup complete!");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
