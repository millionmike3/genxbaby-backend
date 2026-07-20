// lib/contract.ts
import { Address } from "viem";

export const CHECK_REGISTRY_ADDRESS: Address =
  "0x683e29605c03EDE2bCB119eB461AAfFd39B55eec";

export const CHECK_REGISTRY_ABI = [
  // ---- Roles ----
  {
    type: "function",
    name: "DEFAULT_ADMIN_ROLE",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "bytes32" }],
  },
  {
    type: "function",
    name: "REGISTER_ROLE",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "bytes32" }],
  },
  {
    type: "function",
    name: "VOID_ROLE",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "bytes32" }],
  },

  // ---- Check Storage ----
  {
    type: "function",
    name: "getCheck",
    stateMutability: "view",
    inputs: [{ name: "checkNumber", type: "string" }],
    outputs: [
      { name: "amount", type: "uint256" },
      { name: "memo", type: "string" },
      { name: "voided", type: "bool" },
      { name: "exists", type: "bool" },
    ],
  },

  {
    type: "function",
    name: "registerCheck",
    stateMutability: "nonpayable",
    inputs: [
      { name: "checkNumber", type: "string" },
      { name: "amount", type: "uint256" },
      { name: "memo", type: "string" },
    ],
    outputs: [],
  },

  {
    type: "function",
    name: "voidCheck",
    stateMutability: "nonpayable",
    inputs: [{ name: "checkNumber", type: "string" }],
    outputs: [],
  },

  // ---- Audit Root ----
  {
    type: "function",
    name: "latestAuditRoot",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "bytes32" }],
  },

  {
    type: "function",
    name: "anchorAuditRoot",
    stateMutability: "nonpayable",
    inputs: [{ name: "root", type: "bytes32" }],
    outputs: [],
  },

  // ---- Events ----
  {
    type: "event",
    name: "CheckRegistered",
    inputs: [
      { name: "checkNumber", type: "string", indexed: false },
      { name: "amount", type: "uint256", indexed: false },
      { name: "memo", type: "string", indexed: false },
      { name: "actor", type: "address", indexed: true },
    ],
    anonymous: false,
  },

  {
    type: "event",
    name: "CheckVoided",
    inputs: [
      { name: "checkNumber", type: "string", indexed: false },
      { name: "actor", type: "address", indexed: true },
    ],
    anonymous: false,
  },

  {
    type: "event",
    name: "AuditRootAnchored",
    inputs: [
      { name: "root", type: "bytes32", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
      { name: "actor", type: "address", indexed: true },
    ],
    anonymous: false,
  },
] as const;
