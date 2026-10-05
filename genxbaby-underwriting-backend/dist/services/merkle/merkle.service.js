"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashLeaf = hashLeaf;
exports.generateMerkleRoot = generateMerkleRoot;
exports.createMerkleRoot = createMerkleRoot;
const ethers_1 = require("ethers");
const buffer_1 = require("buffer");
/**
 * Hash a single leaf (string → keccak256 hex)
 */
function hashLeaf(leaf) {
    return (0, ethers_1.keccak256)(buffer_1.Buffer.from(leaf));
}
/**
 * Convert hex string → Buffer
 */
function hexToBuffer(hex) {
    return buffer_1.Buffer.from(hex.replace(/^0x/, ""), "hex");
}
/**
 * Generate Merkle root from an array of leaf strings
 * Option A: leaves = ["caseId:riskScore"]
 */
function generateMerkleRoot(leaves) {
    if (!Array.isArray(leaves) || leaves.length === 0) {
        throw new Error("generateMerkleRoot requires a non-empty array");
    }
    // Step 1 — hash each leaf
    const hashedLeaves = leaves.map(leaf => hashLeaf(leaf));
    // Step 2 — convert hex → Buffer
    const buffers = hashedLeaves.map(hex => hexToBuffer(hex));
    // Step 3 — concatenate all hashed leaves
    const concatenated = buffer_1.Buffer.concat(buffers);
    // Step 4 — hash the concatenated buffer → Merkle root
    return (0, ethers_1.keccak256)(concatenated);
}
/**
 * Create Merkle root from JSON payload (optional helper)
 */
function createMerkleRoot(payload) {
    const json = JSON.stringify(payload);
    return (0, ethers_1.keccak256)(buffer_1.Buffer.from(json));
}
