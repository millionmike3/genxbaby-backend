// src/blockchain/anchor.js
import { buildMerkleTree } from "./merkle";
import { getContractWithSigner } from "./client";

export async function anchorSnapshot(leaves) {
  const { root } = buildMerkleTree(leaves);

  const contract = await getContractWithSigner();
  const tx = await contract.anchorMerkleRoot(root);
  const receipt = await tx.wait();

  return {
    merkleRoot: root,
    txHash: receipt.hash,
  };
}
