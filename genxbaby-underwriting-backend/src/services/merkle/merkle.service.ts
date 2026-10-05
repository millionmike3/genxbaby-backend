import { keccak256 } from "ethers";
import { Buffer } from "buffer";

/**
 * Hash a single leaf (string → keccak256 hex)
 */
export function hashLeaf(leaf: string): string {
  return keccak256(Buffer.from(leaf));
}

/**
 * Convert hex string → Buffer
 */
function hexToBuffer(hex: string): Buffer {
  return Buffer.from(hex.replace(/^0x/, ""), "hex");
}

/**
 * Generate Merkle root from an array of leaf strings
 * Option A: leaves = ["caseId:riskScore"]
 */
export function generateMerkleRoot(leaves: string[]): string {
  if (!Array.isArray(leaves) || leaves.length === 0) {
    throw new Error("generateMerkleRoot requires a non-empty array");
  }

  // Step 1 — hash each leaf
  const hashedLeaves = leaves.map(leaf => hashLeaf(leaf));

  // Step 2 — convert hex → Buffer
  const buffers = hashedLeaves.map(hex => hexToBuffer(hex));

  // Step 3 — concatenate all hashed leaves
  const concatenated = Buffer.concat(buffers);

  // Step 4 — hash the concatenated buffer → Merkle root
  return keccak256(concatenated);
}

/**
 * Create Merkle root from JSON payload (optional helper)
 */
export function createMerkleRoot(payload: Record<string, any>): string {
  const json = JSON.stringify(payload);
  return keccak256(Buffer.from(json));
}
