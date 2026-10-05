const hre = require("hardhat");

async function deployAndVerify() {
  console.log("🚀 Deploying CheckRegistry...");

  const CheckRegistry = await hre.ethers.getContractFactory("CheckRegistry");
  const registry = await CheckRegistry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("✅ Deployed at:", address);

  console.log("⏳ Waiting 10 seconds before verifying...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  try {
    await hre.run("verify:verify", {
      address,
      constructorArguments: []
    });
    console.log("🎉 Verified successfully!");
  } catch (err) {
    console.error("❌ Verification failed:");
    console.error(err);
  }

  return address;
}

async function setupRoles(contractAddress) {
  const registerAdmin = process.env.REGISTER_ADMIN;
  const voidAdmin = process.env.VOID_ADMIN;

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

async function registerBatch(contractAddress) {
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

async function main() {
  const action = process.env.ACTION; // deploy, roles, batch
  let contractAddress = process.env.CONTRACT_ADDRESS;

  if (!action) {
    throw new Error("❌ Missing ACTION in .env (deploy | roles | batch)");
  }

  if (action === "deploy") {
    contractAddress = await deployAndVerify();
    console.log("👉 Add this to .env as CONTRACT_ADDRESS:", contractAddress);
    return;
  }

  if (!contractAddress) {
    throw new Error("❌ CONTRACT_ADDRESS missing in .env");
  }

  if (action === "roles") {
    await setupRoles(contractAddress);
  } else if (action === "batch") {
    await registerBatch(contractAddress);
  } else {
    throw new Error("❌ Unknown ACTION. Use deploy | roles | batch");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
