const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) throw new Error("Missing CONTRACT_ADDRESS");

  const registry = await hre.ethers.getContractAt("CheckRegistry", contractAddress);

  const batch = [
    {
      id: 101,
      amount: 500,
      payee: "Vendor A",
      memo: "Supplies",
      bankName: "Chase",
      accountNumberMasked: "****1234",
      routingNumberMasked: "****5678"
    },
    {
      id: 102,
      amount: 1200,
      payee: "Contractor B",
      memo: "Repairs",
      bankName: "Chase",
      accountNumberMasked: "****1234",
      routingNumberMasked: "****5678"
    }
  ];

  console.log("📦 Registering batch of checks...");

  const tx = await registry.registerChecksBatch(batch);
  await tx.wait();

  console.log("🎉 Batch registration complete!");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
