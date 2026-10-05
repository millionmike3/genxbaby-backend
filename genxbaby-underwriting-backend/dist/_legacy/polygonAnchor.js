"use strict";
// src/services/polygonAnchor.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.anchorMerkleRootOnPolygon = anchorMerkleRootOnPolygon;
const ethers_1 = require("ethers");
const config_1 = require("../../blockchain/config");
/**
 * Create provider (server-side, no MetaMask)
 */
function getProvider() {
    return new ethers_1.ethers.JsonRpcProvider(config_1.POLYGON_RPC);
}
/**
 * Create signer (server-side)
 * Replace PRIVATE_KEY with your backend wallet key
 * This wallet will anchor underwriting decisions on-chain
 */
function getSigner() {
    const provider = getProvider();
    const privateKey = process.env.UNDERWRITING_ANCHOR_KEY;
    if (!privateKey) {
        throw new Error("Missing UNDERWRITING_ANCHOR_KEY in environment variables");
    }
    return new ethers_1.ethers.Wallet(privateKey, provider);
}
/**
 * Get write-enabled contract instance
 */
function getContract() {
    const signer = getSigner();
    return new ethers_1.ethers.Contract(config_1.GENXBABY_CONTRACT_ADDRESS, config_1.GENXBABY_CONTRACT_ABI, signer);
}
/**
 * Normalize hex to bytes32
 */
function normalizeBytes32(hex) {
    if (!hex.startsWith("0x"))
        hex = "0x" + hex;
    if (hex.length !== 66) {
        throw new Error(`Invalid bytes32 length: ${hex.length}`);
    }
    return hex;
}
/**
 * Anchor Merkle root on Polygon
 */
async function anchorMerkleRootOnPolygon(merkleRoot) {
    try {
        const normalizedRoot = normalizeBytes32(merkleRoot);
        const contract = getContract();
        console.log("Anchoring Merkle Root:", normalizedRoot);
        const tx = await contract.anchorMerkleRoot(normalizedRoot);
        const receipt = await tx.wait();
        return {
            success: true,
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            root: normalizedRoot,
        };
    }
    catch (err) {
        console.error("Polygon anchoring error:", err);
        return {
            success: false,
            error: err.message || "Unknown error anchoring Merkle root",
        };
    }
}
