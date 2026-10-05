const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CheckRegistry...");

  const CheckRegistry = await ethers.getContractFactory("CheckRegistry");
  const registry = await CheckRegistry.deploy();

  await registry.deployed();

  console.log("CheckRegistry deployed to:", registry.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
