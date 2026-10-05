// src/blockchain/client.js

import { ethers } from "ethers";
import {
  POLYGON_RPC,
  GENXBABY_CONTRACT_ADDRESS,
  GENXBABY_CONTRACT_ABI
} from "./config";

/**
 * Read-only provider (no wallet required)
 * Used for: reading contract state, events, logs
 */
export function getReadProvider() {
  return new ethers.JsonRpcProvider(POLYGON_RPC);
}

/**
 * Browser signer (MetaMask, Coinbase Wallet, etc.)
 * Used for: sending transactions, anchoring Merkle roots
 */
export async function getSigner() {
  if (!window.ethereum) {
    throw new Error("No wallet detected. Please install MetaMask.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider.getSigner();
}

/**
 * Read-only contract instance
 * Used for: reading data, listening to events
 */
export function getReadContract() {
  const provider = getReadProvider();
  return new ethers.Contract(
    GENXBABY_CONTRACT_ADDRESS,
    GENXBABY_CONTRACT_ABI,
    provider
  );
}

/**
 * Write-enabled contract instance
 * Used for: sending transactions (anchorMerkleRoot)
 */
export async function getWriteContract() {
  const signer = await getSigner();
  return new ethers.Contract(
    GENXBABY_CONTRACT_ADDRESS,
    GENXBABY_CONTRACT_ABI,
    signer
  );
}

/**
 * Utility: request wallet connection
 */
export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found.");
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts"
  });

  return accounts[0];
}

/**
 * Utility: listen for MerkleRootAnchored events
 */
export function listenForAnchors(callback) {
  const contract = getReadContract();

  contract.on("MerkleRootAnchored", (merkleRoot, owner) => {
    callback({
      merkleRoot,
      owner
    });
  });

  return () => {
    contract.removeAllListeners("MerkleRootAnchored");
  };
}
