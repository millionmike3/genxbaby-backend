import { ethers } from "ethers";
import underwritingAbi from "./underwriting.abi.json";

// Required environment variables
const RPC_URL = process.env.POLYGON_RPC_URL as string;
const PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY as string;
const CONTRACT_ADDRESS = process.env.UNDERWRITING_CONTRACT_ADDRESS as string;

// Validate environment variables
if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error(
    "Missing blockchain environment variables: POLYGON_RPC_URL, POLYGON_PRIVATE_KEY, UNDERWRITING_CONTRACT_ADDRESS"
  );
}

// Provider + signer
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract instance
export const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  underwritingAbi,
  signer
);

export { provider, signer };
