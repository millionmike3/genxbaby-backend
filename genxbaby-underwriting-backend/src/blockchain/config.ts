// src/blockchain/config.ts

import { ethers } from "ethers";

export const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL as string;
export const UNDERWRITING_ANCHOR_CONTRACT_ADDRESS =
  process.env.UNDERWRITING_ANCHOR_CONTRACT_ADDRESS as string;

// Minimal ABI: function anchor(bytes32 merkleRoot) returns (bool)
export const UNDERWRITING_ANCHOR_ABI = [
  "function anchor(bytes32 merkleRoot) public returns (bool)"
];

export function getPolygonProvider() {
  if (!POLYGON_RPC_URL) {
    throw new Error("POLYGON_RPC_URL is not set");
  }
  return new ethers.JsonRpcProvider(POLYGON_RPC_URL);
}

export function getUnderwritingAnchorContract(signer: ethers.Signer) {
  if (!UNDERWRITING_ANCHOR_CONTRACT_ADDRESS) {
    throw new Error("UNDERWRITING_ANCHOR_CONTRACT_ADDRESS is not set");
  }

  return new ethers.Contract(
    UNDERWRITING_ANCHOR_CONTRACT_ADDRESS,
    UNDERWRITING_ANCHOR_ABI,
    signer
  );
}
