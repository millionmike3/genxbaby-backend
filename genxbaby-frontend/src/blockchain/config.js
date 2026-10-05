// src/blockchain/config.js

// Polygon Amoy RPC (Alchemy)
export const POLYGON_RPC =
  "https://polygon-amoy.g.alchemy.com/v2/W7aJ5gWL9AXh-CkUJEiHl";

// GENXBABY Smart Contract Address (Polygon Amoy)
export const GENXBABY_CONTRACT_ADDRESS =
  "0xC8933D0b2953d69c170958052021815c9CC1575c";

// Minimal ABI for anchoring + events
export const GENXBABY_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "bytes32", name: "merkleRoot", type: "bytes32" }
    ],
    name: "anchorMerkleRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "MerkleRootAnchored",
    type: "event"
  }
];
