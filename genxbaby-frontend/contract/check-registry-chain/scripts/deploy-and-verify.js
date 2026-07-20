const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CheckRegistry...");

  const CheckRegistry = await hre.ethers.getContractFactory("CheckRegistry");
  const registry = await CheckRegistry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("✅ Deployed at:", address);

  console.log("🔍 Waiting 10 seconds before verifying...");
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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
