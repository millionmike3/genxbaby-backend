import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const artifact = await import("../artifacts/contracts/UnderwritingAnchor.sol/UnderwritingAnchor.json");

  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );

  console.log("Deploying UnderwritingAnchor…");
  const contract = await factory.deploy();

  await contract.waitForDeployment();
  console.log("UnderwritingAnchor deployed at:", contract.target);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
