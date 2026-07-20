const hre = require("hardhat");

async function main() {
  console.log("Deploying CheckRegistry...");

  const CheckRegistry = await hre.ethers.getContractFactory("CheckRegistry");
  const registry = await CheckRegistry.deploy();

  await registry.waitForDeployment();

  console.log("CheckRegistry deployed at:", await registry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
