import { keccak256 } from "ethers";
import { Buffer } from "buffer";

export function generateMerkleRoot(leaves: string[]): string {
  const buffers = leaves.map(leaf =>
    Buffer.from(leaf.replace(/^0x/, ""), "hex")
  );
  const concatenated = Buffer.concat(buffers);
  return keccak256(concatenated);
}
