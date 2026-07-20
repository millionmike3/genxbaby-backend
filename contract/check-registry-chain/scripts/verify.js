const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("❌ CONTRACT_ADDRESS is missing. Add it to your .env file.");
  }

  console.log("🔍 Verifying CheckRegistry at:", contractAddress);

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: []
    });

    console.log("✅ Verification successful!");
  } catch (err) {
    console.error("❌ Verification failed:");
    console.error(err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
