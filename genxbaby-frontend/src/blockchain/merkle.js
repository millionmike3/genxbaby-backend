// src/blockchain/merkle.js
import { keccak256 } from "ethers";

export function hashLeaf(data) {
  return keccak256(Buffer.from(JSON.stringify(data)));
}

export function buildMerkleTree(leaves) {
  if (leaves.length === 0) throw new Error("No leaves");

  let level = leaves.map((l) => hashLeaf(l));

  const tree = [level];

  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] || level[i]; // duplicate last if odd
      next.push(keccak256(Buffer.concat([Buffer.from(left.slice(2), "hex"), Buffer.from(right.slice(2), "hex")])));
    }
    level = next;
    tree.push(level);
  }

  const root = level[0];
  return { root, tree };
}
