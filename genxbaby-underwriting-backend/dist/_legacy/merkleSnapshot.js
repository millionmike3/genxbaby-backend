"use strict";
// src/services/merkleSnapshot.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDecision = normalizeDecision;
exports.generateMerkleSnapshot = generateMerkleSnapshot;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Hash helper (SHA-256 → hex → 0x-prefixed)
 */
function sha256(data) {
    return "0x" + crypto_1.default.createHash("sha256").update(data).digest("hex");
}
/**
 * Normalize underwriting decision into deterministic JSON
 */
function normalizeDecision(decision) {
    return JSON.stringify({
        applicationId: decision.applicationId,
        status: decision.status,
        tier: decision.tier,
        finalRate: decision.finalRate,
        notes: decision.notes,
        timestamp: decision.timestamp,
    }, Object.keys({
        applicationId: "",
        status: "",
        tier: "",
        finalRate: "",
        notes: "",
        timestamp: "",
    }).sort());
}
/**
 * Build Merkle tree from array of leaf hashes
 */
function buildMerkleTree(leaves) {
    if (leaves.length === 0) {
        return { tree: [], root: null };
    }
    let level = [...leaves];
    const tree = [level];
    while (level.length > 1) {
        const nextLevel = [];
        for (let i = 0; i < level.length; i += 2) {
            const left = level[i];
            const right = level[i + 1] ?? left; // duplicate last if odd count
            const combined = left + right.replace("0x", "");
            const parentHash = sha256(combined);
            nextLevel.push(parentHash);
        }
        level = nextLevel;
        tree.push(level);
    }
    return {
        tree,
        root: level[0],
    };
}
/**
 * Generate Merkle snapshot for underwriting decision
 */
function generateMerkleSnapshot(decision) {
    // Normalize decision → deterministic JSON
    const normalized = normalizeDecision(decision);
    // Hash leaf
    const leaf = sha256(normalized);
    // Build Merkle tree (single leaf → root = leaf)
    const { tree, root } = buildMerkleTree([leaf]);
    return {
        leaf,
        tree,
        merkleRoot: root,
        anchorReadyRoot: root, // ready for Polygon smart contract
    };
}
