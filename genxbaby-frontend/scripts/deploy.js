async function main() {
  const CheckRegistry = await ethers.getContractFactory("CheckRegistry");
  const registry = await CheckRegistry.deploy();
  await registry.waitForDeployment();
  console.log("Deployed at:", await registry.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
